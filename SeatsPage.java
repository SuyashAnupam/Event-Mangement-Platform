/** Seat map for one schedule, with the booking form. */
public class SeatsPage extends Page {

    public SeatsPage(EventManagementSystem system, Customer customer) {
        super(system, customer);
    }

    @Override
    public String getPath() {
        return "/seats";
    }

    @Override
    public String getTitle() {
        return "Book Tickets";
    }

    @Override
    public boolean showInNav() {
        return false;
    }

    @Override
    protected String renderContent(WebRequest request) {
        EventSchedule schedule = system.findSchedule(request.getInt("id", -1));
        if (schedule == null) {
            return "<p class=\"muted\">Invalid schedule. <a href=\"/schedules\">Back to schedules</a></p>";
        }

        StringBuilder html = new StringBuilder();
        html.append("<div class=\"card\"><h2>").append(esc(schedule.getEvent().getName())).append("</h2>")
            .append("<p class=\"muted\">").append(esc(schedule.getVenue().getName())).append(", ")
            .append(esc(schedule.getVenue().getLocation())).append(" · ")
            .append(esc(schedule.getDate())).append(" at ").append(esc(schedule.getTime())).append("</p></div>");

        html.append("<form class=\"card\" method=\"post\" action=\"/book\">")
            .append("<input type=\"hidden\" name=\"scheduleId\" value=\"").append(schedule.getScheduleId()).append("\">")
            .append("<div class=\"stage\">STAGE</div><div class=\"seats\">");

        for (char row = EventSchedule.FIRST_ROW; row <= EventSchedule.LAST_ROW; row++) {
            for (int n = 1; n <= EventSchedule.SEATS_PER_ROW; n++) {
                String seat = row + String.valueOf(n);
                String disabled = schedule.isSeatAvailable(seat) ? "" : " disabled";
                html.append("<label class=\"seat\"><input type=\"checkbox\" name=\"seats\" value=\"")
                    .append(seat).append("\"").append(disabled).append("><span>")
                    .append(seat).append("</span></label>");
            }
        }
        html.append("</div><p class=\"muted\">Click seats to select them. Greyed-out seats are already booked.</p>");

        html.append("<div class=\"types\"><strong>Ticket type</strong>");
        SeatType[] types = SeatType.values();
        for (int i = 0; i < types.length; i++) {
            String checked = i == 0 ? " checked" : "";
            html.append("<label><input type=\"radio\" name=\"seatType\" value=\"").append(types[i].name())
                .append("\"").append(checked).append("> ").append(types[i].name())
                .append(" — ").append(money(types[i].getPrice())).append(" per seat</label>");
        }
        html.append("</div><p><button class=\"btn\" type=\"submit\">Confirm booking</button></p></form>");
        return html.toString();
    }
}
