import java.util.HashMap;
import java.util.Map;

public class Show {

    private int showId;
    private Movie movie;
    private Theatre theatre;
    private String date;
    private String time;

    private Map<String, Boolean> seats;

    public Show(int showId, Movie movie, Theatre theatre,
                String date, String time) {

        this.showId = showId;
        this.movie = movie;
        this.theatre = theatre;
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

    public int getShowId() {
        return showId;
    }

    public Movie getMovie() {
        return movie;
    }

    public Theatre getTheatre() {
        return theatre;
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

    public void displayShow() {

        System.out.println("----------------------------------------");
        System.out.println("Show ID  : " + showId);
        System.out.println("Movie    : " + movie.getTitle());
        System.out.println("Theatre  : " + theatre.getName());
        System.out.println("Location : " + theatre.getLocation());
        System.out.println("Date     : " + date);
        System.out.println("Time     : " + time);
        System.out.println("----------------------------------------");
    }
}