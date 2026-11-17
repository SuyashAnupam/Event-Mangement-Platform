import java.util.List;

/** Handles the booking form submitted from the seats page. */
public class BookAction extends Action {

    public BookAction(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/book";
    }

    @Override
    public String execute(WebRequest request) {
        int scheduleId = request.getInt("scheduleId", -1);
        String back = "/seats?id=" + scheduleId;

        EventSchedule schedule = system.findSchedule(scheduleId);
        if (schedule == null) {
            return redirect("/schedules", "Invalid schedule.", false);
        }

        SeatType seatType;
        try {
            seatType = SeatType.valueOf(request.get("seatType"));
        } catch (IllegalArgumentException e) {
            return redirect(back, "Please choose a ticket type.", false);
        }

        List<String> seats = request.getAll("seats");
        if (seats.isEmpty()) {
            return redirect(back, "Please select at least one seat.", false);
        }

        Booking booking = system.createBooking(customer, scheduleId, seatType, seats.toArray(new String[0]));
        if (booking == null) {
            return redirect(back, "One or more selected seats are no longer available.", false);
        }

        return redirect("/bookings", "Booking #" + booking.getBookingId() + " confirmed for seats "
                + String.join(", ", booking.getSelectedSeats()) + ".", true);
    }
}
