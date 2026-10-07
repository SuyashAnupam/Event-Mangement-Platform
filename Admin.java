public class Admin extends User {

    public Admin(int userId, String name, String email) {
        super(userId, name, email);
    }

    @Override
    public void displayProfile() {
        System.out.println("\n========== ADMIN PROFILE ==========");
        System.out.println("Admin ID : " + getUserId());
        System.out.println("Name     : " + getName());
        System.out.println("Email    : " + getEmail());
    }
}