import java.util.HashMap;
import java.util.Map;

public class EventSchedule {

    private int scheduleId;
    private Event event;
    private Venue venue;
    private String date;
    private String time;

    private Map<String, Boolean> seats;

    public EventSchedule(int scheduleId, Event event, Venue venue,
                String date, String time) {

        this.scheduleId = scheduleId;
        this.event = event;
        this.venue = venue;
        this.date = date;
        this.time = time;

        seats = new HashMap<>();

        initializeSeats();
    }

    private void initializeSeats() {

        for (char row = 'A'; row <= 'D'; row++) {

            for (int number = 1; number <= 5; number++) {

                String seat = row + String.valueOf(number);

                seats.put(seat, true);
            }
        }
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public Event getEvent() {
        return event;
    }

    public Venue getVenue() {
        return venue;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public boolean isSeatAvailable(String seat) {

        return seats.containsKey(seat) && seats.get(seat);
    }

    public boolean bookSeat(String seat) {

        if (isSeatAvailable(seat)) {

            seats.put(seat, false);

            return true;
        }

        return false;
    }

    public void cancelSeat(String seat) {

        if (seats.containsKey(seat)) {
            seats.put(seat, true);
        }
    }

    public void displaySeats() {

        System.out.println("\n========== SEAT MAP ==========");

        for (char row = 'A'; row <= 'D'; row++) {

            for (int number = 1; number <= 5; number++) {

                String seat = row + String.valueOf(number);

                if (seats.get(seat)) {
                    System.out.print("[" + seat + "] ");
                } else {
                    System.out.print("[ X ] ");
                }
            }

            System.out.println();
        }

        System.out.println("\n[Seat] = Available");
        System.out.println("[ X ] = Booked");
    }

    public void displaySchedule() {

        System.out.println("----------------------------------------");
        System.out.println("Schedule ID : " + scheduleId);
        System.out.println("Event       : " + event.getName());
        System.out.println("Venue       : " + venue.getName());
        System.out.println("Location    : " + venue.getLocation());
        System.out.println("Date     : " + date);
        System.out.println("Time     : " + time);
        System.out.println("----------------------------------------");
    }
}
