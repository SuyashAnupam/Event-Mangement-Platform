import java.util.ArrayList;

public class Customer extends User {

    private ArrayList<Booking> bookings;

    public Customer(int userId, String name, String email) {
        super(userId, name, email);
        bookings = new ArrayList<>();
    }

    @Override
    public void displayProfile() {
        System.out.println("\n========== ATTENDEE PROFILE ==========");
        System.out.println("User ID : " + getUserId());
        System.out.println("Name    : " + getName());
        System.out.println("Email   : " + getEmail());
    }

    public void addBooking(Booking booking) {
        bookings.add(booking);
    }

    public ArrayList<Booking> getBookings() {
        return bookings;
    }

    public void displayBookings() {

        System.out.println("\n========== MY EVENT BOOKINGS ==========");

        if (bookings.isEmpty()) {
            System.out.println("No bookings found.");
            return;
        }

        for (Booking booking : bookings) {
            booking.displayBooking();
        }
    }
}
