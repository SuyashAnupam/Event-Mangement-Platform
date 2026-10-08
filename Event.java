public class Event {

    private int eventId;
    private String name;
    private String category;
    private String organizer;
    private String description;

    public Event(int eventId, String name, String category,
                 String organizer, String description) {

        this.eventId = eventId;
        this.name = name;
        this.category = category;
        this.organizer = organizer;
        this.description = description;
    }

    public int getEventId() {
        return eventId;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getOrganizer() {
        return organizer;
    }

    public String getDescription() {
        return description;
    }

    public void displayEvent() {

        System.out.println("----------------------------------------");
        System.out.println("Event ID     : " + eventId);
        System.out.println("Event Name   : " + name);
        System.out.println("Category     : " + category);
        System.out.println("Organizer    : " + organizer);
        System.out.println("Description  : " + description);
        System.out.println("----------------------------------------");
    }
}
