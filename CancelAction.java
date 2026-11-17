/** Handles the "Cancel booking" button. */
public class CancelAction extends Action {

    public CancelAction(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/cancel";
    }

    @Override
    public String execute(WebRequest request) {
        int bookingId = request.getInt("bookingId", -1);
        if (system.cancelBooking(bookingId)) {
            return redirect("/bookings", "Booking #" + bookingId + " cancelled. Seats released.", true);
        }
        return redirect("/bookings", "Booking not found or already cancelled.", false);
    }
}
