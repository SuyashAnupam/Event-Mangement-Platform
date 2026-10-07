import java.util.ArrayList;

public class Booking implements Bookable {

    private int bookingId;
    private Customer customer;
    private Show show;

    private ArrayList<String> selectedSeats;

    private SeatType seatType;

    private double totalAmount;

    private BookingStatus status;

    public Booking(int bookingId,
                   Customer customer,
                   Show show,
                   SeatType seatType) {

        this.bookingId = bookingId;
        this.customer = customer;
        this.show = show;
        this.seatType = seatType;

        selectedSeats = new ArrayList<>();

        status = BookingStatus.CANCELLED;
        totalAmount = 0;
    }

    @Override
    public boolean bookSeats(String[] seats) {

        // First check whether all seats are available

        for (String seat : seats) {

            seat = seat.toUpperCase();

            if (!show.isSeatAvailable(seat)) {

                System.out.println(
                        "Seat " + seat + " is not available."
                );

                return false;
            }
        }

        // Book all seats

        for (String seat : seats) {

            seat = seat.toUpperCase();

            show.bookSeat(seat);

            selectedSeats.add(seat);
        }

        totalAmount = seats.length * seatType.getPrice();

        status = BookingStatus.CONFIRMED;

        return true;
    }

    @Override
    public boolean cancelBooking() {

        if (status == BookingStatus.CANCELLED) {

            return false;
        }

        for (String seat : selectedSeats) {

            show.cancelSeat(seat);
        }

        status = BookingStatus.CANCELLED;

        return true;
    }

    public int getBookingId() {
        return bookingId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public ArrayList<String> getSelectedSeats() {
        return selectedSeats;
    }

    public void displayBooking() {

        System.out.println("\n========================================");
        System.out.println("          MOVIE TICKET");
        System.out.println("========================================");

        System.out.println("Booking ID : " + bookingId);
        System.out.println("Customer   : " + customer.getName());
        System.out.println("Movie      : " + show.getMovie().getTitle());
        System.out.println("Theatre    : " + show.getTheatre().getName());
        System.out.println("Location   : " + show.getTheatre().getLocation());
        System.out.println("Date       : " + show.getDate());
        System.out.println("Time       : " + show.getTime());

        System.out.println("Seat Type  : " + seatType);
        System.out.println("Seats      : " + selectedSeats);
        System.out.println("Amount     : ₹" + totalAmount);
        System.out.println("Status     : " + status);

        System.out.println("========================================");
    }
}