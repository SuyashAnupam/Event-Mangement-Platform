import java.util.List;

/**
 * Abstract base class for every web page (Abstraction + Inheritance).
 *
 * Each subclass only decides its own path, title and content.
 * The shared layout (header, navigation, styles, messages) lives here,
 * and render() calls the subclass's renderContent() — Polymorphism.
 */
public abstract class Page {

    protected final EventManagementSystem system;
    protected final Customer customer;

    protected Page(EventManagementSystem system, Customer customer) {
        this.system = system;
        this.customer = customer;
    }

    public abstract String getPath();

    public abstract String getTitle();

    protected abstract String renderContent(WebRequest request);

    /** Pages can override this to hide themselves from the top menu. */
    public boolean showInNav() {
        return true;
    }

    /** Template method: same layout for every page, content varies. */
    public final String render(WebRequest request, List<Page> navPages) {
        StringBuilder nav = new StringBuilder();
        for (Page page : navPages) {
            if (!page.showInNav()) continue;
            String active = page.getPath().equals(getPath()) ? " class=\"active\"" : "";
            nav.append("<a href=\"").append(page.getPath()).append("\"").append(active).append(">")
               .append(esc(page.getTitle())).append("</a>");
        }

        String message = "";
        if (!request.get("msg").isEmpty()) {
            String kind = request.get("ok").equals("1") ? "ok" : "error";
            message = "<div class=\"msg " + kind + "\">" + esc(request.get("msg")) + "</div>";
        }

        return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
                + "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
                + "<title>" + esc(getTitle()) + " · Event Management System</title>"
                + "<style>" + STYLES + "</style></head><body>"
                + "<header><div class=\"wrap\"><a class=\"brand\" href=\"/\">Event Management System</a>"
                + "<nav>" + nav + "</nav></div></header>"
                + "<main class=\"wrap\"><h1>" + esc(getTitle()) + "</h1>" + message
                + renderContent(request)
                + "</main></body></html>";
    }

    /** Escapes text so it is safe to place inside HTML. */
    protected static String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }

    protected static String money(double amount) {
        return "₹" + String.format("%.0f", amount);
    }

    private static final String STYLES = """
            *{box-sizing:border-box}
            body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f4f5f7;color:#1f2430}
            .wrap{max-width:960px;margin:0 auto;padding:0 16px}
            header{background:#1f2a44;color:#fff}
            header .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px}
            .brand{color:#fff;font-weight:700;text-decoration:none;font-size:18px}
            nav a{color:#c9d2e8;text-decoration:none;margin-left:16px;font-size:15px}
            nav a:hover,nav a.active{color:#fff;text-decoration:underline}
            h1{font-size:24px;margin:24px 0 16px}
            h2{font-size:18px;margin:0 0 6px}
            .card{background:#fff;border:1px solid #e2e5eb;border-radius:8px;padding:16px;margin-bottom:14px}
            .muted{color:#667085;font-size:14px}
            .badge{display:inline-block;background:#e8eefc;color:#2f4ea8;border-radius:12px;padding:2px 10px;font-size:12px;margin-left:6px}
            .badge.green{background:#e3f5e9;color:#1d7a3e}
            .badge.red{background:#fde8e8;color:#b42318}
            table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e5eb;border-radius:8px;overflow:hidden}
            th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #eef0f3;font-size:14px}
            th{background:#f8f9fb}
            .table-scroll{overflow-x:auto}
            .btn{display:inline-block;background:#2f4ea8;color:#fff;border:0;border-radius:6px;padding:8px 14px;font-size:14px;text-decoration:none;cursor:pointer}
            .btn:hover{background:#243d86}
            .btn.danger{background:#b42318}
            .btn.small{padding:5px 10px;font-size:13px}
            form.inline{display:inline}
            input[type=text],select{padding:8px 10px;border:1px solid #cfd4dc;border-radius:6px;font-size:14px}
            .search{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
            .search input[type=text]{flex:1;min-width:180px}
            .msg{padding:10px 14px;border-radius:6px;margin-bottom:16px}
            .msg.ok{background:#e3f5e9;color:#1d7a3e}
            .msg.error{background:#fde8e8;color:#b42318}
            .stage{background:#d6dbe6;text-align:center;border-radius:6px;padding:6px;font-size:13px;margin-bottom:14px}
            .seats{display:grid;grid-template-columns:repeat(5,minmax(0,56px));gap:8px;justify-content:center;margin-bottom:16px}
            .seat input{display:none}
            .seat span{display:block;text-align:center;padding:10px 0;border-radius:6px;border:1px solid #9fb0d6;background:#fff;cursor:pointer;font-size:14px}
            .seat input:checked+span{background:#2f4ea8;color:#fff;border-color:#2f4ea8}
            .seat input:disabled+span{background:#e5e7eb;color:#9ca3af;border-color:#e5e7eb;cursor:not-allowed;text-decoration:line-through}
            .types label{display:block;margin:6px 0}
            .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
            .stat{font-size:22px;font-weight:700}
            """;
}
