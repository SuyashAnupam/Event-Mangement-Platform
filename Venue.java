public class Venue {

    private int venueId;
    private String name;
    private String location;

    public Venue(int venueId, String name, String location) {
        this.venueId = venueId;
        this.name = name;
        this.location = location;
    }

    public int getVenueId() {
        return venueId;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public void displayVenue() {

        System.out.println("----------------------------------------");
        System.out.println("Venue ID   : " + venueId);
        System.out.println("Venue      : " + name);
        System.out.println("Location   : " + location);
        System.out.println("----------------------------------------");
    }
}
