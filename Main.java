import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        EventManagementSystem system = new EventManagementSystem();
        Customer customer = new Customer(1, "Suyash", "suyash@example.com");
        int choice;

        do {
            System.out.println("\n╔══════════════════════════════════════╗");
            System.out.println("║       EVENT MANAGEMENT SYSTEM        ║");
            System.out.println("╚══════════════════════════════════════╝");
            System.out.println("1. View Events");
            System.out.println("2. Search Event");
            System.out.println("3. Search Event by Category");
            System.out.println("4. View Venues");
            System.out.println("5. View Event Schedules");
            System.out.println("6. View Available Seats");
            System.out.println("7. Book Event Ticket");
            System.out.println("8. View My Bookings");
            System.out.println("9. Cancel Booking");
            System.out.println("10. My Profile");
            System.out.println("0. Exit");
            System.out.print("\nEnter your choice: ");
            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1:
                    system.displayEvents();
                    break;
                case 2:
                    System.out.print("Enter event name: ");
                    system.searchEvent(sc.nextLine());
                    break;
                case 3:
                    System.out.print("Enter category: ");
                    system.searchEventByCategory(sc.nextLine());
                    break;
                case 4:
                    system.displayVenues();
                    break;
                case 5:
                    system.displaySchedules();
                    break;
                case 6:
                    system.displaySchedules();
                    System.out.print("\nEnter Schedule ID: ");
                    EventSchedule seatSchedule = system.findSchedule(sc.nextInt());
                    if (seatSchedule != null) seatSchedule.displaySeats();
                    else System.out.println("Invalid Schedule ID.");
                    break;
                case 7:
                    bookEventTicket(sc, system, customer);
                    break;
                case 8:
                    customer.displayBookings();
                    break;
                case 9:
                    customer.displayBookings();
                    System.out.print("\nEnter Booking ID to cancel: ");
                    system.cancelBooking(sc.nextInt());
                    break;
                case 10:
                    customer.displayProfile();
                    break;
                case 0:
                    System.out.println("\nThank you for using Event Management System!");
                    break;
                default:
                    System.out.println("Invalid choice. Try again.");
            }
        } while (choice != 0);
        sc.close();
    }

    private static void bookEventTicket(Scanner sc, EventManagementSystem system,
                                        Customer customer) {
        system.displaySchedules();
        System.out.print("\nEnter Schedule ID: ");
        int scheduleId = sc.nextInt();
        EventSchedule selectedSchedule = system.findSchedule(scheduleId);
        if (selectedSchedule == null) {
            System.out.println("Invalid Schedule ID.");
            return;
        }

        selectedSchedule.displaySeats();
        System.out.println("\nTicket Types:");
        System.out.println("1. REGULAR - ₹199");
        System.out.println("2. PREMIUM - ₹349");
        System.out.println("3. VIP - ₹599");
        System.out.print("Select ticket type: ");
        int ticketChoice = sc.nextInt();
        SeatType seatType;
        if (ticketChoice == 1) seatType = SeatType.REGULAR;
        else if (ticketChoice == 2) seatType = SeatType.PREMIUM;
        else if (ticketChoice == 3) seatType = SeatType.VIP;
        else {
            System.out.println("Invalid ticket type.");
            return;
        }

        System.out.print("Enter number of tickets: ");
        int numberOfSeats = sc.nextInt();
        if (numberOfSeats <= 0) {
            System.out.println("Number of tickets must be positive.");
            return;
        }
        sc.nextLine();
        String[] seats = new String[numberOfSeats];
        for (int i = 0; i < numberOfSeats; i++) {
            System.out.print("Enter seat " + (i + 1) + ": ");
            seats[i] = sc.nextLine().toUpperCase();
        }

        Booking booking = system.createBooking(customer, scheduleId, seatType, seats);
        if (booking != null) {
            System.out.println("\nBOOKING SUCCESSFUL!");
            booking.displayBooking();
        } else {
            System.out.println("\nBOOKING FAILED!");
        }
    }
}
