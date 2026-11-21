/** Shows all venues. */
public class VenuesPage extends Page {

    public VenuesPage(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/venues";
    }

    @Override
    public String getTitle() {
        return "Venues";
    }

    @Override
    protected String renderContent(WebRequest request) {
        StringBuilder html = new StringBuilder();
        html.append("<div class=\"table-scroll\"><table><tr><th>ID</th><th>Venue</th><th>Location</th></tr>");
        for (Venue venue : system.getVenues()) {
            html.append("<tr><td>").append(venue.getVenueId())
                .append("</td><td>").append(esc(venue.getName()))
                .append("</td><td>").append(esc(venue.getLocation()))
                .append("</td></tr>");
        }
        html.append("</table></div>");
        return html.toString();
    }
}
