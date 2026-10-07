import java.util.ArrayList;

public class MovieBookingSystem {

    private ArrayList<Movie> movies;
    private ArrayList<Theatre> theatres;
    private ArrayList<Show> shows;
    private ArrayList<Booking> bookings;

    private int nextBookingId = 1001;

    public MovieBookingSystem() {

        movies = new ArrayList<>();
        theatres = new ArrayList<>();
        shows = new ArrayList<>();
        bookings = new ArrayList<>();

        loadSampleData();
    }

    private void loadSampleData() {

        Movie m1 = new Movie(
                101,
                "Avengers: Endgame",
                "Action",
                "English",
                8.4
        );

        Movie m2 = new Movie(
                102,
                "Interstellar",
                "Sci-Fi",
                "English",
                8.7
        );

        Movie m3 = new Movie(
                103,
                "3 Idiots",
                "Comedy/Drama",
                "Hindi",
                8.4
        );

        movies.add(m1);
        movies.add(m2);
        movies.add(m3);


        Theatre t1 = new Theatre(
                201,
                "PVR Orion Mall",
                "Rajajinagar, Bangalore"
        );

        Theatre t2 = new Theatre(
                202,
                "INOX Garuda Mall",
                "Magrath Road, Bangalore"
        );

        theatres.add(t1);
        theatres.add(t2);


        shows.add(
                new Show(
                        301,
                        m1,
                        t1,
                        "10-10-2026",
                        "10:00 AM"
                )
        );

        shows.add(
                new Show(
                        302,
                        m1,
                        t1,
                        "10-10-2026",
                        "7:30 PM"
                )
        );

        shows.add(
                new Show(
                        303,
                        m2,
                        t2,
                        "10-10-2026",
                        "2:30 PM"
                )
        );

        shows.add(
                new Show(
                        304,
                        m3,
                        t2,
                        "10-10-2026",
                        "6:30 PM"
                )
        );
    }

    public void displayMovies() {

        System.out.println("\n========== AVAILABLE MOVIES ==========");

        for (Movie movie : movies) {
            movie.displayMovie();
        }
    }

    public void displayTheatres() {

        System.out.println("\n========== AVAILABLE THEATRES ==========");

        for (Theatre theatre : theatres) {
            theatre.displayTheatre();
        }
    }

    public void displayShows() {

        System.out.println("\n========== AVAILABLE SHOWS ==========");

        for (Show show : shows) {
            show.displayShow();
        }
    }

    // Method overloading - search by title
    public void searchMovie(String title) {

        boolean found = false;

        for (Movie movie : movies) {

            if (movie.getTitle()
                    .toLowerCase()
                    .contains(title.toLowerCase())) {

                movie.displayMovie();

                found = true;
            }
        }

        if (!found) {
            System.out.println("Movie not found.");
        }
    }

    // Method overloading - search by genre
    public void searchMovieByGenre(String genre) {

        boolean found = false;

        for (Movie movie : movies) {

            if (movie.getGenre()
                    .equalsIgnoreCase(genre)) {

                movie.displayMovie();

                found = true;
            }
        }

        if (!found) {
            System.out.println("No movies found in this genre.");
        }
    }

    public Show findShow(int showId) {

        for (Show show : shows) {

            if (show.getShowId() == showId) {
                return show;
            }
        }

        return null;
    }

    public Booking createBooking(
            Customer customer,
            int showId,
            SeatType seatType,
            String[] seats) {

        Show show = findShow(showId);

        if (show == null) {

            System.out.println("Invalid Show ID.");

            return null;
        }

        Booking booking = new Booking(
                nextBookingId++,
                customer,
                show,
                seatType
        );

        if (booking.bookSeats(seats)) {

            bookings.add(booking);

            customer.addBooking(booking);

            return booking;
        }

        return null;
    }

    public boolean cancelBooking(int bookingId) {

        for (Booking booking : bookings) {

            if (booking.getBookingId() == bookingId) {

                if (booking.cancelBooking()) {

                    System.out.println(
                            "Booking cancelled successfully."
                    );

                    return true;
                }
            }
        }

        System.out.println("Booking not found.");

        return false;
    }
}