import java.util.ArrayList;

/** Shows the customer's tickets with a cancel button. */
public class BookingsPage extends Page {

    public BookingsPage(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/bookings";
    }

    @Override
    public String getTitle() {
        return "My Bookings";
    }

    @Override
    protected String renderContent(WebRequest request) {
        ArrayList<Booking> bookings = customer.getBookings();
        if (bookings.isEmpty()) {
            return "<p class=\"muted\">No bookings yet. <a href=\"/\">Browse events</a></p>";
        }

        StringBuilder html = new StringBuilder();
        // Newest booking first
        for (int i = bookings.size() - 1; i >= 0; i--) {
            Booking b = bookings.get(i);
            EventSchedule s = b.getSchedule();
            boolean confirmed = b.getStatus() == BookingStatus.CONFIRMED;

            html.append("<div class=\"card\"><h2>").append(esc(s.getEvent().getName()))
                .append("<span class=\"badge ").append(confirmed ? "green" : "red").append("\">")
                .append(b.getStatus()).append("</span></h2>")
                .append("<p class=\"muted\">Booking #").append(b.getBookingId()).append(" · ")
                .append(esc(b.getCustomer().getName())).append("</p>")
                .append("<p>").append(esc(s.getVenue().getName())).append(", ").append(esc(s.getVenue().getLocation()))
                .append("<br>").append(esc(s.getDate())).append(" at ").append(esc(s.getTime()))
                .append("<br>").append(b.getSeatType()).append(" · Seats ")
                .append(esc(String.join(", ", b.getSelectedSeats())))
                .append("<br><strong>").append(money(b.getTotalAmount())).append("</strong></p>");

            if (confirmed) {
                html.append("<form class=\"inline\" method=\"post\" action=\"/cancel\">")
                    .append("<input type=\"hidden\" name=\"bookingId\" value=\"").append(b.getBookingId()).append("\">")
                    .append("<button class=\"btn danger small\" type=\"submit\">Cancel booking</button></form>");
            }
            html.append("</div>");
        }
        return html.toString();
    }
}
