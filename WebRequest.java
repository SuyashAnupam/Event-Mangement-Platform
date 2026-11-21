import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Wraps an incoming HTTP request and gives easy access to its
 * query-string and form parameters (Encapsulation).
 */
public class WebRequest {

    private final String method;
    private final String path;
    private final Map<String, List<String>> params = new HashMap<>();

    public WebRequest(HttpExchange exchange) throws IOException {
        this.method = exchange.getRequestMethod();
        this.path = exchange.getRequestURI().getPath();

        parse(exchange.getRequestURI().getRawQuery());

        if (method.equalsIgnoreCase("POST")) {
            byte[] body = exchange.getRequestBody().readAllBytes();
            parse(new String(body, StandardCharsets.UTF_8));
        }
    }

    private void parse(String raw) {
        if (raw == null || raw.isEmpty()) return;

        for (String pair : raw.split("&")) {
            int eq = pair.indexOf('=');
            String key = decode(eq >= 0 ? pair.substring(0, eq) : pair);
            String value = decode(eq >= 0 ? pair.substring(eq + 1) : "");
            params.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }
    }

    private static String decode(String s) {
        return URLDecoder.decode(s, StandardCharsets.UTF_8);
    }

    public String getMethod() {
        return method;
    }

    public String getPath() {
        return path;
    }

    public String get(String key) {
        return get(key, "");
    }

    public String get(String key, String defaultValue) {
        List<String> values = params.get(key);
        return (values == null || values.isEmpty()) ? defaultValue : values.get(0);
    }

    public List<String> getAll(String key) {
        return params.getOrDefault(key, new ArrayList<>());
    }

    public int getInt(String key, int defaultValue) {
        try {
            return Integer.parseInt(get(key).trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
