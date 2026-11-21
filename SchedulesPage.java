/** Shows every event schedule with seat availability. */
public class SchedulesPage extends Page {

    public SchedulesPage(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/schedules";
    }

    @Override
    public String getTitle() {
        return "Schedules";
    }

    @Override
    protected String renderContent(WebRequest request) {
        StringBuilder html = new StringBuilder();
        html.append("<div class=\"table-scroll\"><table><tr><th>ID</th><th>Event</th><th>Venue</th>")
            .append("<th>Date</th><th>Time</th><th>Seats left</th><th></th></tr>");
        for (EventSchedule s : system.getSchedules()) {
            html.append("<tr><td>").append(s.getScheduleId())
                .append("</td><td>").append(esc(s.getEvent().getName()))
                .append("</td><td>").append(esc(s.getVenue().getName()))
                .append("<br><span class=\"muted\">").append(esc(s.getVenue().getLocation())).append("</span>")
                .append("</td><td>").append(esc(s.getDate()))
                .append("</td><td>").append(esc(s.getTime()))
                .append("</td><td>").append(s.getAvailableSeatCount()).append(" / ").append(s.getTotalSeatCount())
                .append("</td><td><a class=\"btn small\" href=\"/seats?id=").append(s.getScheduleId())
                .append("\">Select seats</a></td></tr>");
        }
        html.append("</table></div>");
        return html.toString();
    }
}
