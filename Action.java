import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Abstract base class for form submissions (POST requests).
 * Each subclass performs one operation and returns where the
 * browser should be redirected afterwards.
 */
public abstract class Action {

    protected final EventManagementSystem system;
    protected final Customer customer;

    protected Action(EventManagementSystem system, Customer customer) {
        this.system = system;
        this.customer = customer;
    }

    public abstract String getPath();

    /** Performs the action and returns the redirect URL. */
    public abstract String execute(WebRequest request);

    protected static String redirect(String path, String message, boolean success) {
        String sep = path.contains("?") ? "&" : "?";
        return path + sep + "ok=" + (success ? "1" : "0")
                + "&msg=" + URLEncoder.encode(message, StandardCharsets.UTF_8);
    }
}
