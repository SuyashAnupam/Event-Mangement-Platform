import java.util.ArrayList;

public class Booking implements Bookable {

    private int bookingId;
    private Customer customer;
    private EventSchedule schedule;

    private ArrayList<String> selectedSeats;

    private SeatType seatType;

    private double totalAmount;

    private BookingStatus status;

    public Booking(int bookingId,
                   Customer customer,
                   EventSchedule schedule,
                   SeatType seatType) {

        this.bookingId = bookingId;
        this.customer = customer;
        this.schedule = schedule;
        this.seatType = seatType;

        selectedSeats = new ArrayList<>();

        status = BookingStatus.CANCELLED;
        totalAmount = 0;
    }

    @Override
    public boolean bookSeats(String[] seats) {

        // First check whether all seats are available

        for (String seat : seats) {

            seat = seat.toUpperCase();

            if (!schedule.isSeatAvailable(seat)) {

                System.out.println(
                        "Seat " + seat + " is not available."
                );

                return false;
            }
        }

        // Book all seats

        for (String seat : seats) {

            seat = seat.toUpperCase();

            schedule.bookSeat(seat);

            selectedSeats.add(seat);
        }

        totalAmount = seats.length * seatType.getPrice();

        status = BookingStatus.CONFIRMED;

        return true;
    }

    @Override
    public boolean cancelBooking() {

        if (status == BookingStatus.CANCELLED) {

            return false;
        }

        for (String seat : selectedSeats) {

            schedule.cancelSeat(seat);
        }

        status = BookingStatus.CANCELLED;

        return true;
    }

    public int getBookingId() {
        return bookingId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public ArrayList<String> getSelectedSeats() {
        return selectedSeats;
    }

    public void displayBooking() {

        System.out.println("\n========================================");
        System.out.println("          EVENT TICKET");
        System.out.println("========================================");

        System.out.println("Booking ID : " + bookingId);
        System.out.println("Attendee   : " + customer.getName());
        System.out.println("Event      : " + schedule.getEvent().getName());
        System.out.println("Venue      : " + schedule.getVenue().getName());
        System.out.println("Location   : " + schedule.getVenue().getLocation());
        System.out.println("Date       : " + schedule.getDate());
        System.out.println("Time       : " + schedule.getTime());

        System.out.println("Seat Type  : " + seatType);
        System.out.println("Seats      : " + selectedSeats);
        System.out.println("Amount     : ₹" + totalAmount);
        System.out.println("Status     : " + status);

        System.out.println("========================================");
    }
}
