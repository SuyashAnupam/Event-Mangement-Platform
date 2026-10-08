public enum SeatType {
    REGULAR(199),
    PREMIUM(349),
    VIP(599);

    private final double price;

    SeatType(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }
}
