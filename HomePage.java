import java.util.ArrayList;

/** Lists events with search by name and filter by category. */
public class HomePage extends Page {

    public HomePage(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/";
    }

    @Override
    public String getTitle() {
        return "Events";
    }

    @Override
    protected String renderContent(WebRequest request) {
        String query = request.get("q");
        String category = request.get("category");

        StringBuilder html = new StringBuilder();

        // Search form
        html.append("<form class=\"search\" method=\"get\" action=\"/\">")
            .append("<input type=\"text\" name=\"q\" placeholder=\"Search events by name\" value=\"")
            .append(esc(query)).append("\">")
            .append("<select name=\"category\"><option value=\"\">All categories</option>");
        for (String c : system.getCategories()) {
            String selected = c.equalsIgnoreCase(category) ? " selected" : "";
            html.append("<option").append(selected).append(">").append(esc(c)).append("</option>");
        }
        html.append("</select><button class=\"btn\" type=\"submit\">Search</button></form>");

        ArrayList<Event> events = system.findEvents(query, category);
        if (events.isEmpty()) {
            html.append("<p class=\"muted\">No events found.</p>");
        }

        for (Event event : events) {
            html.append("<div class=\"card\">")
                .append("<h2>").append(esc(event.getName()))
                .append("<span class=\"badge\">").append(esc(event.getCategory())).append("</span></h2>")
                .append("<p class=\"muted\">Organised by ").append(esc(event.getOrganizer()))
                .append(" · Event ID ").append(event.getEventId()).append("</p>")
                .append("<p>").append(esc(event.getDescription())).append("</p>");

            for (EventSchedule s : system.getSchedulesForEvent(event)) {
                html.append("<p>").append(esc(s.getDate())).append(" at ").append(esc(s.getTime()))
                    .append(" — ").append(esc(s.getVenue().getName()))
                    .append(" <span class=\"muted\">(").append(s.getAvailableSeatCount()).append(" seats left)</span> ")
                    .append("<a class=\"btn small\" href=\"/seats?id=").append(s.getScheduleId())
                    .append("\">Book</a></p>");
            }
            html.append("</div>");
        }
        return html.toString();
    }
}
