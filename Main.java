import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        MovieBookingSystem system =
                new MovieBookingSystem();

        Customer customer =
                new Customer(
                        1,
                        "Suyash",
                        "suyash@example.com"
                );

        int choice;

        do {

            System.out.println("\n");
            System.out.println("╔══════════════════════════════════════╗");
            System.out.println("║    MOVIE TICKET BOOKING SYSTEM       ║");
            System.out.println("╚══════════════════════════════════════╝");

            System.out.println("1. View Movies");
            System.out.println("2. Search Movie");
            System.out.println("3. Search Movie by Genre");
            System.out.println("4. View Theatres");
            System.out.println("5. View Shows");
            System.out.println("6. View Available Seats");
            System.out.println("7. Book Ticket");
            System.out.println("8. View My Bookings");
            System.out.println("9. Cancel Booking");
            System.out.println("10. My Profile");
            System.out.println("0. Exit");

            System.out.print("\nEnter your choice: ");

            choice = sc.nextInt();

            sc.nextLine();

            switch (choice) {

                case 1:

                    system.displayMovies();

                    break;


                case 2:

                    System.out.print(
                            "Enter movie title: "
                    );

                    String title = sc.nextLine();

                    system.searchMovie(title);

                    break;


                case 3:

                    System.out.print(
                            "Enter genre: "
                    );

                    String genre = sc.nextLine();

                    system.searchMovieByGenre(genre);

                    break;


                case 4:

                    system.displayTheatres();

                    break;


                case 5:

                    system.displayShows();

                    break;


                case 6:

                    system.displayShows();

                    System.out.print(
                            "\nEnter Show ID: "
                    );

                    int seatShowId = sc.nextInt();

                    Show seatShow =
                            system.findShow(seatShowId);

                    if (seatShow != null) {

                        seatShow.displaySeats();

                    } else {

                        System.out.println(
                                "Invalid Show ID."
                        );
                    }

                    break;


                case 7:

                    system.displayShows();

                    System.out.print(
                            "\nEnter Show ID: "
                    );

                    int showId = sc.nextInt();

                    Show selectedShow =
                            system.findShow(showId);

                    if (selectedShow == null) {

                        System.out.println(
                                "Invalid Show ID."
                        );

                        break;
                    }

                    selectedShow.displaySeats();

                    System.out.println(
                            "\nSeat Types:"
                    );

                    System.out.println(
                            "1. REGULAR - ₹180"
                    );

                    System.out.println(
                            "2. PREMIUM - ₹250"
                    );

                    System.out.println(
                            "3. RECLINER - ₹350"
                    );

                    System.out.print(
                            "Select seat type: "
                    );

                    int seatChoice = sc.nextInt();

                    SeatType seatType;

                    if (seatChoice == 1) {

                        seatType = SeatType.REGULAR;

                    } else if (seatChoice == 2) {

                        seatType = SeatType.PREMIUM;

                    } else if (seatChoice == 3) {

                        seatType = SeatType.RECLINER;

                    } else {

                        System.out.println(
                                "Invalid seat type."
                        );

                        break;
                    }

                    System.out.print(
                            "Enter number of seats: "
                    );

                    int numberOfSeats = sc.nextInt();

                    sc.nextLine();

                    String[] seats =
                            new String[numberOfSeats];

                    for (int i = 0;
                         i < numberOfSeats;
                         i++) {

                        System.out.print(
                                "Enter seat " +
                                (i + 1) +
                                ": "
                        );

                        seats[i] =
                                sc.nextLine()
                                  .toUpperCase();
                    }

                    Booking booking =
                            system.createBooking(
                                    customer,
                                    showId,
                                    seatType,
                                    seats
                            );

                    if (booking != null) {

                        System.out.println(
                                "\nBOOKING SUCCESSFUL!"
                        );

                        booking.displayBooking();

                    } else {

                        System.out.println(
                                "\nBOOKING FAILED!"
                        );
                    }

                    break;


                case 8:

                    customer.displayBookings();

                    break;


                case 9:

                    customer.displayBookings();

                    System.out.print(
                            "\nEnter Booking ID to cancel: "
                    );

                    int bookingId = sc.nextInt();

                    system.cancelBooking(
                            bookingId
                    );

                    break;


                case 10:

                    customer.displayProfile();

                    break;


                case 0:

                    System.out.println(
                            "\nThank you for using " +
                            "Movie Ticket Booking System!"
                    );

                    break;


                default:

                    System.out.println(
                            "Invalid choice. Try again."
                    );
            }

        } while (choice != 0);

        sc.close();
    }
}