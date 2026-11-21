/** Shows the logged-in user's profile and booking summary. */
public class ProfilePage extends Page {

    public ProfilePage(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/profile";
    }

    @Override
    public String getTitle() {
        return "My Profile";
    }

    @Override
    protected String renderContent(WebRequest request) {
        int confirmed = 0;
        int cancelled = 0;
        double spent = 0;
        for (Booking b : customer.getBookings()) {
            if (b.getStatus() == BookingStatus.CONFIRMED) {
                confirmed++;
                spent += b.getTotalAmount();
            } else {
                cancelled++;
            }
        }

        // customer is stored as a Customer, but getRole() is declared in User (polymorphism)
        User user = customer;

        return "<div class=\"card\"><h2>" + esc(user.getName())
                + "<span class=\"badge\">" + esc(user.getRole()) + "</span></h2>"
                + "<p class=\"muted\">User ID " + user.getUserId() + " · " + esc(user.getEmail()) + "</p></div>"
                + "<div class=\"grid\">"
                + "<div class=\"card\"><div class=\"muted\">Confirmed bookings</div><div class=\"stat\">" + confirmed + "</div></div>"
                + "<div class=\"card\"><div class=\"muted\">Cancelled bookings</div><div class=\"stat\">" + cancelled + "</div></div>"
                + "<div class=\"card\"><div class=\"muted\">Total spent</div><div class=\"stat\">" + money(spent) + "</div></div>"
                + "</div>";
    }
}
