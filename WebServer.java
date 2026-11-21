import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Entry point for the website.
 * Uses Java's built-in HTTP server — no external libraries.
 *
 * Every page is a Page subclass and every form is an Action subclass.
 * The server just looks them up by path and calls them polymorphically.
 */
public class WebServer {

    private final List<Page> pages = new ArrayList<>();
    private final Map<String, Page> pagesByPath = new HashMap<>();
    private final Map<String, Action> actionsByPath = new HashMap<>();

    public WebServer() {
        EventManagementSystem system = new EventManagementSystem();
        Customer customer = new Customer(1, "Suyash", "suyash@example.com");

        addPage(new HomePage(system, customer));
        addPage(new SchedulesPage(system, customer));
        addPage(new VenuesPage(system, customer));
        addPage(new BookingsPage(system, customer));
        addPage(new ProfilePage(system, customer));
        addPage(new SeatsPage(system, customer));

        addAction(new BookAction(system, customer));
        addAction(new CancelAction(system, customer));
    }

    private void addPage(Page page) {
        pages.add(page);
        pagesByPath.put(page.getPath(), page);
    }

    private void addAction(Action action) {
        actionsByPath.put(action.getPath(), action);
    }

    public void start(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/", this::handle);
        server.setExecutor(null); // single thread: requests handled one at a time, so no seat race conditions
        server.start();
        System.out.println("Event Management System running at http://localhost:" + port);
    }

    private void handle(HttpExchange exchange) throws IOException {
        try {
            WebRequest request = new WebRequest(exchange);
            String path = request.getPath();

            if (request.getMethod().equalsIgnoreCase("POST") && actionsByPath.containsKey(path)) {
                String location = actionsByPath.get(path).execute(request);
                exchange.getResponseHeaders().set("Location", location);
                exchange.sendResponseHeaders(303, -1);
            } else if (request.getMethod().equalsIgnoreCase("GET") && pagesByPath.containsKey(path)) {
                send(exchange, 200, pagesByPath.get(path).render(request, pages));
            } else {
                send(exchange, 404, "<h1>404 - Page not found</h1><p><a href=\"/\">Go home</a></p>");
            }
        } catch (Exception e) {
            e.printStackTrace();
            send(exchange, 500, "<h1>500 - Something went wrong</h1>");
        } finally {
            exchange.close();
        }
    }

    private void send(HttpExchange exchange, int status, String html) throws IOException {
        byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(bytes);
        }
    }

    public static void main(String[] args) throws IOException {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
        new WebServer().start(port);
    }
}
