import java.util.ArrayList;

public class EventManagementSystem {
    private ArrayList<Event> events;
    private ArrayList<Venue> venues;
    private ArrayList<EventSchedule> schedules;
    private ArrayList<Booking> bookings;
    private int nextBookingId = 1001;

    public EventManagementSystem() {
        events = new ArrayList<>();
        venues = new ArrayList<>();
        schedules = new ArrayList<>();
        bookings = new ArrayList<>();
        loadSampleData();
    }

    private void loadSampleData() {
        Event e1 = new Event(101, "Tech Innovators Summit", "Conference", "Future Minds", "Technology talks and networking.");
        Event e2 = new Event(102, "Rhythm of India", "Music Concert", "Live Nation", "An evening of live Indian music.");
        Event e3 = new Event(103, "Bangalore Food Festival", "Food Festival", "Taste Collective", "Food stalls, workshops and live demos.");
        events.add(e1);
        events.add(e2);
        events.add(e3);

        Venue v1 = new Venue(201, "Orion Convention Hall", "Rajajinagar, Bangalore");
        Venue v2 = new Venue(202, "Garuda Open Arena", "Magrath Road, Bangalore");
        venues.add(v1);
        venues.add(v2);

        schedules.add(new EventSchedule(301, e1, v1, "10-10-2026", "10:00 AM"));
        schedules.add(new EventSchedule(302, e1, v1, "10-10-2026", "2:00 PM"));
        schedules.add(new EventSchedule(303, e2, v2, "11-10-2026", "6:30 PM"));
        schedules.add(new EventSchedule(304, e3, v2, "12-10-2026", "12:00 PM"));
    }

    public void displayEvents() {
        System.out.println("\n========== AVAILABLE EVENTS ==========");
        for (Event event : events) event.displayEvent();
    }

    public void displayVenues() {
        System.out.println("\n========== AVAILABLE VENUES ==========");
        for (Venue venue : venues) venue.displayVenue();
    }

    public void displaySchedules() {
        System.out.println("\n========== EVENT SCHEDULES ==========");
        for (EventSchedule schedule : schedules) schedule.displaySchedule();
    }

    public void searchEvent(String name) {
        boolean found = false;
        for (Event event : events) {
            if (event.getName().toLowerCase().contains(name.toLowerCase())) {
                event.displayEvent();
                found = true;
            }
        }
        if (!found) System.out.println("Event not found.");
    }

    public void searchEventByCategory(String category) {
        boolean found = false;
        for (Event event : events) {
            if (event.getCategory().equalsIgnoreCase(category)) {
                event.displayEvent();
                found = true;
            }
        }
        if (!found) System.out.println("No events found in this category.");
    }

    public EventSchedule findSchedule(int scheduleId) {
        for (EventSchedule schedule : schedules) {
            if (schedule.getScheduleId() == scheduleId) return schedule;
        }
        return null;
    }

    public Booking createBooking(Customer customer, int scheduleId, SeatType seatType, String[] seats) {
        EventSchedule schedule = findSchedule(scheduleId);
        if (schedule == null) {
            System.out.println("Invalid Schedule ID.");
            return null;
        }
        Booking booking = new Booking(nextBookingId++, customer, schedule, seatType);
        if (booking.bookSeats(seats)) {
            bookings.add(booking);
            customer.addBooking(booking);
            return booking;
        }
        return null;
    }

    public boolean cancelBooking(int bookingId) {
        for (Booking booking : bookings) {
            if (booking.getBookingId() == bookingId && booking.cancelBooking()) {
                System.out.println("Booking cancelled successfully.");
                return true;
            }
        }
        System.out.println("Booking not found or already cancelled.");
        return false;
    }
}
