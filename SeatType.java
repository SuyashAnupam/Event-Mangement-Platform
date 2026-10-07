public enum SeatType {
    REGULAR(180),
    PREMIUM(250),
    RECLINER(350);

    private final double price;

    SeatType(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }
}