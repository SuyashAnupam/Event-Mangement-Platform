const pptxgen = require("pptxgenjs");
const path = require("path");
const { applyTheme } = require("./apply_theme.js");

const SHOTS = path.join(__dirname, "screenshots");
const OUT = process.argv[2] || path.join(__dirname, "..", "Event_Management_System_OOP.pptx");

const THEME = {
  name: "Event Ticket",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1A1B2E", lt1: "FFFFFF", dk2: "3A3D5C", lt2: "F2F1F7",
    accent1: "E8505B", accent2: "F5A623", accent3: "3D7DD8", accent4: "2BAE8E",
    accent5: "8E5CD9", accent6: "6B7280", hlink: "3D7DD8", folHlink: "8E5CD9",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Event Management System – Java OOP Mini Project";
pres.author = "Suyash Anupam, Shetty Ashvij Udaya, Shamith Raghavendra Prasad";
const C = pres.SchemeColor;
const MONO = "Courier New";

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.28, w: 9, h: 0.62, fontSize: 30, bold: true, color: C.text1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: "Event Management System  ·  Java OOP Lab", options: { x: 0.5, y: 5.22, w: 6, h: 0.28, fontSize: 9, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.22, w: 0.5, h: 0.28, fontSize: 9, color: C.accent6, align: "right" },
});
pres.defineSlideMaster({
  title: "SECTION",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.25, w: 8.4, h: 0.9, fontSize: 40, bold: true, color: C.background1, align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 3.15, w: 8.4, h: 0.6, fontSize: 16, color: "C9CBE0", align: "left", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({ title: "DARK", background: { color: C.text1 }, objects: [] });

// ---------- helpers ----------
const KW = new Set("public private protected abstract class interface extends implements return new final static void boolean int double char if else for while try catch throws throw this super enum null true false import continue".split(" "));
const COL = { def: "E4E6F0", kw: "C792EA", type: "FFCB6B", str: "A8D88A", com: "7C8299", ann: "F78C6C", num: "F78C6C", fn: "82AAFF" };

function highlight(code) {
  const runs = [];
  const lines = code.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  lines.forEach((line, li) => {
    const parts = [];
    const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(@\w+)|([A-Za-z_]\w*)|(\d+(?:\.\d+)?)|(\s+)|(.)/g;
    let m;
    while ((m = re.exec(line))) {
      let color = COL.def, italic = false;
      if (m[1]) { color = COL.com; italic = true; }
      else if (m[2]) color = COL.str;
      else if (m[3]) color = COL.ann;
      else if (m[4]) {
        const w = m[4];
        if (KW.has(w)) color = COL.kw;
        else if (/^[A-Z]/.test(w)) color = /^[A-Z_]+$/.test(w) && w.length > 1 ? COL.num : COL.type;
        else if (line[re.lastIndex] === "(") color = COL.fn;
      } else if (m[5]) color = COL.num;
      const last = parts[parts.length - 1];
      if (last && (last.color === color && last.italic === italic || /^\s+$/.test(m[0]) && !italic)) {
        last.text += m[0];
      } else parts.push({ text: m[0], color, italic });
    }
    if (!parts.length) parts.push({ text: " ", color: COL.def, italic: false });
    parts.forEach((p, i) => {
      const o = { color: p.color, fontFace: MONO };
      if (p.italic) o.italic = true;
      if (i === parts.length - 1 && li < lines.length - 1) o.breakLine = true;
      runs.push({ text: p.text, options: o });
    });
  });
  return runs;
}

function codePanel(slide, { x, y, w, h, file, code, size = 11, name, plain = false }) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: "1E1F36" }, line: { color: "1E1F36" }, objectName: (name || file) + " panel",
    shadow: { type: "outer", color: "1A1B2E", opacity: 0.25, blur: 6, offset: 2, angle: 90 } });
  ["FF5F57", "FEBC2E", "28C840"].forEach((c, i) =>
    slide.addShape(pres.shapes.OVAL, { x: x + 0.16 + i * 0.17, y: y + 0.13, w: 0.1, h: 0.1, fill: { color: c }, line: { color: c } }));
  slide.addText(file, { x: x + 0.75, y: y + 0.06, w: w - 0.9, h: 0.24, fontSize: 9.5, color: "9AA0B8", fontFace: MONO, margin: 0, isTextBox: true, valign: "middle" });
  slide.addText(plain ? [{ text: code.replace(/^\n/, "").replace(/\s+$/, ""), options: { color: "D7DAE8", fontFace: MONO } }] : highlight(code), { x: x + 0.18, y: y + 0.4, w: w - 0.3, h: h - 0.5, fontSize: size, valign: "top", margin: 0, isTextBox: true, objectName: file + " code", paraSpaceAfter: 0 });
}

function card(slide, { x, y, w, h, fill = C.background2, name }) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill }, objectName: name || "card" });
}

function badge(slide, { x, y, n, d = 0.42, fill = C.accent1, size = 14 }) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  slide.addText(String(n), { x, y, w: d, h: d, fontSize: size, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

function bullets(slide, items, opts) {
  slide.addText(items.map((t, i) => {
    const o = { bullet: { indent: 14 }, breakLine: i < items.length - 1 };
    if (Array.isArray(t)) return t.map((r, j) => ({ text: r.text, options: Object.assign({}, r.options, j === 0 ? { bullet: { indent: 14 } } : {}, j === t.length - 1 && i < items.length - 1 ? { breakLine: true } : {}) }));
    return { text: t, options: o };
  }).flat(), Object.assign({ fontSize: 14, color: C.text2, paraSpaceAfter: 7, valign: "top", margin: 0, isTextBox: true }, opts));
}

function tag(slide, text, { x, y, w, h = 0.32, fill = C.accent1, color = C.background1, size = 11, mono = false }) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.5, fill: { color: fill }, line: { color: fill } });
  slide.addText(text, { x, y, w, h, fontSize: size, color, bold: !mono, fontFace: mono ? MONO : undefined, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

function shot(slide, file, { x, y, w, pxW, pxH, name }) {
  const h = w * pxH / pxW;
  slide.addShape(pres.shapes.RECTANGLE, { x: x - 0.02, y: y - 0.02, w: w + 0.04, h: h + 0.04, fill: { color: "D9DCE6" }, line: { color: "D9DCE6" },
    shadow: { type: "outer", color: "1A1B2E", opacity: 0.22, blur: 8, offset: 3, angle: 90 } });
  slide.addImage({ path: path.join(SHOTS, file), x, y, w, h, altText: name });
  return h;
}

function arrow(slide, x1, y1, x2, y2, color = C.accent6, label) {
  const o = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color, width: 1.75, endArrowType: "triangle" } };
  if (x2 < x1) o.flipH = true;
  if (y2 < y1) o.flipV = true;
  slide.addShape(pres.shapes.LINE, o);
}

function line(slide, x1, y1, x2, y2, color = C.accent6, extra = {}) {
  slide.addShape(pres.shapes.LINE, Object.assign({ x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: Object.assign({ color, width: 1.5 }, extra) }));
}

function box(slide, text, { x, y, w, h, fill = C.background2, color = C.text1, size = 13, bold = true, sub, subColor, mono = false, lineColor }) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: lineColor || fill, width: lineColor ? 1.25 : 0.75 } });
  const runs = [{ text, options: { fontSize: size, bold, color, fontFace: mono ? MONO : undefined, breakLine: !!sub } }];
  if (sub) runs.push({ text: sub, options: { fontSize: Math.max(10, size - 3), color: subColor || C.accent6, bold: false } });
  slide.addText(runs, { x, y, w, h, align: "center", valign: "middle", margin: 2, isTextBox: true });
}

let section = "Introduction";
function content(title, notes) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}
function divider(num, title, sub, notes) {
  section = title;
  pres.addSection({ title });
  const s = pres.addSlide({ masterName: "SECTION", sectionTitle: section });
  s.addText(num, { x: 0.8, y: 1.25, w: 3, h: 1.0, fontSize: 60, bold: true, color: C.accent1, margin: 0, isTextBox: true });
  s.addText(title, { placeholder: "title" });
  s.addText(sub, { placeholder: "body" });
  if (notes) s.addNotes(notes);
  return s;
}

// =====================================================================
// 1. TITLE
pres.addSection({ title: "Introduction" });
{
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: section });
  s.addText("JAVA OOP LAB  ·  MINI PROJECT", { x: 0.6, y: 0.55, w: 4.8, h: 0.3, fontSize: 12, bold: true, color: C.accent2, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText("Event Management System", { x: 0.6, y: 0.9, w: 4.9, h: 1.3, fontSize: 40, bold: true, color: C.background1, margin: 0, valign: "top", isTextBox: true });
  s.addText("An event booking website built with Core Java, with no frameworks, to show OOP concepts in a real project", { x: 0.6, y: 2.25, w: 4.7, h: 0.75, fontSize: 14, color: "C9CBE0", margin: 0, valign: "top", isTextBox: true });
  s.addText([
    { text: "Team", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "Suyash Anupam  (1RF25CS156)", options: { color: C.background1, breakLine: true } },
    { text: "Shetty Ashvij Udaya  (1RF25CS140)", options: { color: C.background1, breakLine: true } },
    { text: "Shamith Raghavendra Prasad  (1RF25CS139)", options: { color: C.background1, breakLine: true } },
    { text: "Unnava Trinadh  (1RF25CS166)", options: { color: C.background1 } },
  ], { x: 0.6, y: 3.15, w: 4.7, h: 1.4, fontSize: 13, margin: 0, valign: "top", isTextBox: true, paraSpaceAfter: 2 });
  s.addText("Guide: Prof. Murugan S, Dept. of CSE  ·  RV Institute of Technology and Management", { x: 0.6, y: 4.6, w: 4.8, h: 0.5, fontSize: 11, color: "9AA0B8", margin: 0, valign: "top", isTextBox: true });
  shot(s, "home.png", { x: 5.75, y: 0.75, w: 3.75, pxW: 980, pxH: 801, name: "Screenshot of the Events home page" });
  s.addNotes("Introduce the team and the project. One line: this is a working event booking website written only in Core Java, built to show how OOP concepts are used in a real application.");
}

// 2. OVERVIEW
{
  const s = content("What we built", "Explain the problem in plain words: attendees browse events, choose a show, pick seats and book. Read out the numbers on the right. Stress: no Spring, no database, no external jars. Everything is Core Java.");
  s.addText("A web app where attendees book seats for conferences, concerts and food festivals. It covers browsing, schedules, seat selection, booking and cancellation.", { x: 0.5, y: 1.1, w: 4.4, h: 1.0, fontSize: 15, color: C.text1, margin: 0, valign: "top", isTextBox: true });
  bullets(s, [
    "Search events by name and filter by category",
    "Live 4 × 5 seat map; a seat can never be booked twice",
    "REGULAR, PREMIUM and VIP ticket pricing",
    "My Bookings with one-click cancel that frees the seats",
    "Profile with booking stats and total spent",
  ], { x: 0.5, y: 2.25, w: 4.4, h: 2.8 });
  const stats = [["3", "Events"], ["2", "Venues"], ["4", "Scheduled shows"], ["20", "Seats per show"], ["24", "Java classes"], ["0", "External libraries"]];
  stats.forEach(([n, l], i) => {
    const cx = 5.3 + (i % 2) * 2.15, cy = 1.1 + Math.floor(i / 2) * 1.33;
    card(s, { x: cx, y: cy, w: 2.0, h: 1.18, name: "stat " + l });
    s.addText(n, { x: cx + 0.2, y: cy + 0.1, w: 1.6, h: 0.6, fontSize: 32, bold: true, color: i === 5 ? C.accent4 : C.accent1, margin: 0, isTextBox: true });
    s.addText(l, { x: cx + 0.2, y: cy + 0.72, w: 1.7, h: 0.32, fontSize: 12, color: C.text2, margin: 0, isTextBox: true });
  });
}

// 3. USER FLOW
{
  const s = content("How an attendee books a ticket", "Walk through the 6 steps. Each step is a page or form in the website, and each one maps to a Java class. Show the class names under each step.");
  const steps = [
    ["Browse", "Search by name or filter by category", "HomePage"],
    ["Schedules", "See date, time, venue and seats left", "SchedulesPage"],
    ["Seat map", "Booked seats are greyed out", "SeatsPage"],
    ["Ticket type", "REGULAR / PREMIUM / VIP", "SeatType enum"],
    ["Confirm", "Seats checked, booked, total calculated", "BookAction"],
    ["Manage", "View tickets, cancel to free seats", "BookingsPage"],
  ];
  const w = 1.4, gap = 0.12;
  steps.forEach(([t, d, cls], i) => {
    const x = 0.5 + i * (w + gap);
    card(s, { x, y: 1.55, w, h: 3.2, name: "step " + t });
    badge(s, { x: x + 0.15, y: 1.72, n: i + 1 });
    s.addText(t, { x: x + 0.15, y: 2.3, w: w - 0.25, h: 0.4, fontSize: 15, bold: true, color: C.text1, margin: 0, isTextBox: true });
    s.addText(d, { x: x + 0.15, y: 2.72, w: w - 0.25, h: 1.2, fontSize: 12, color: C.text2, margin: 0, valign: "top", isTextBox: true });
    s.addText(cls, { x: x + 0.1, y: 4.25, w: w - 0.2, h: 0.32, fontSize: 9.5, color: C.accent3, fontFace: MONO, margin: 0, isTextBox: true, align: "left" });
  });
  s.addText("Each step is one Java class: a Page subclass shows it, an Action subclass handles its form", { x: 0.5, y: 1.05, w: 9, h: 0.35, fontSize: 14, italic: true, color: C.accent1, margin: 0, isTextBox: true });
}

// 4. TECH STACK
{
  const s = content("Tech stack and how to run it", "Mention JDK 17+ (we tested on JDK 26). The HTTP server ships inside the JDK, so nothing has to be downloaded. One script compiles and starts the site.");
  const items = [
    ["Core Java (JDK 17+)", "All logic, pages and OOP design"],
    ["com.sun.net.httpserver", "Built-in JDK web server, no Spring"],
    ["Collections Framework", "ArrayList and HashMap hold all data in memory"],
    ["HTML + CSS", "Generated as strings by Java page classes"],
  ];
  items.forEach(([t, d], i) => {
    const x = 0.5 + (i % 2) * 2.3, y = 1.15 + Math.floor(i / 2) * 1.55;
    card(s, { x, y, w: 2.15, h: 1.4, name: "tech " + t });
    badge(s, { x: x + 0.15, y: y + 0.15, n: i + 1, d: 0.36, size: 12, fill: C.accent3 });
    s.addText(t, { x: x + 0.15, y: y + 0.58, w: 1.9, h: 0.3, fontSize: 13, bold: true, color: C.text1, margin: 0, isTextBox: true });
    s.addText(d, { x: x + 0.15, y: y + 0.88, w: 1.9, h: 0.48, fontSize: 11, color: C.text2, margin: 0, valign: "top", isTextBox: true });
  });
  s.addText("Hardware: Core i3+, 4 GB RAM. Runs on Windows, macOS or Linux.", { x: 0.5, y: 4.35, w: 4.5, h: 0.5, fontSize: 12, color: C.accent6, margin: 0, isTextBox: true, valign: "top" });
  codePanel(s, { x: 5.35, y: 1.15, w: 4.15, h: 1.55, file: "run.sh", size: 10.5, code: `
# compile everything into ./out, then start
cd "$(dirname "$0")"
javac -d out *.java &&
  java -cp out WebServer "$@"` });
  codePanel(s, { x: 5.35, y: 2.9, w: 4.15, h: 1.45, file: "terminal", size: 10.5, plain: true, code: `
$ ./run.sh
Event Management System running at
  http://localhost:8080` });
  s.addText("Then open the address in any browser", { x: 5.35, y: 4.45, w: 4.15, h: 0.3, fontSize: 12, color: C.accent6, margin: 0, isTextBox: true });
}

// =====================================================================
divider("01", "System Design", "Two layers, one class hierarchy", "Section 1: how the code is organised before we get to individual OOP concepts.");

// 6. ARCHITECTURE
{
  const s = content("Two-layer architecture", "The key design idea: business classes do not know a website exists. We started with a console app (Main.java), then added a web layer on top without changing the business logic. Both front ends share the same classes.");
  box(s, "Web browser", { x: 0.5, y: 1.1, w: 2.4, h: 0.55, fill: C.background1, lineColor: C.accent6, sub: null });
  arrow(s, 1.7, 1.65, 1.7, 2.05, C.accent6);
  // web layer
  card(s, { x: 0.5, y: 2.05, w: 5.9, h: 1.3, fill: "E6EEFB", name: "web layer" });
  s.addText("WEB LAYER", { x: 0.7, y: 2.13, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.accent3, charSpacing: 1, margin: 0, isTextBox: true });
  [["WebServer", 1.15], ["WebRequest", 1.25], ["Page × 6", 1.05], ["Action × 2", 1.15]].reduce((x, [t, w]) => {
    tag(s, t, { x, y: 2.55, w, h: 0.42, fill: C.background1, color: C.text1, size: 11, mono: true }); return x + w + 0.15;
  }, 0.7);
  arrow(s, 3.45, 3.35, 3.45, 3.75, C.accent6);
  // console
  box(s, "Main.java", { x: 6.9, y: 2.25, w: 2.6, h: 0.9, fill: C.background1, lineColor: C.accent6, mono: true, size: 13, sub: "console menu (Scanner)" });
  arrow(s, 8.2, 3.15, 8.2, 3.75, C.accent6);
  // business layer
  card(s, { x: 0.5, y: 3.75, w: 9, h: 1.3, fill: "FDECEC", name: "business layer" });
  s.addText("BUSINESS LOGIC", { x: 0.7, y: 3.83, w: 3, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 1, margin: 0, isTextBox: true });
  [["EventManagementSystem", 2.25], ["Event", 0.7], ["Venue", 0.7], ["EventSchedule", 1.45], ["Booking", 0.9], ["User", 0.6], ["Customer", 1.0]].reduce((x, [t, w]) => {
    tag(s, t, { x, y: 4.27, w, h: 0.42, fill: C.background1, color: C.text1, size: 10.5, mono: true }); return x + w + 0.1;
  }, 0.7);
  s.addText([
    { text: "Separation of concerns: ", options: { bold: true, color: C.text1 } },
    { text: "the same business classes run both the console app and the website", options: { color: C.text2 } },
  ], { x: 3.2, y: 1.05, w: 6.3, h: 0.7, fontSize: 13, margin: 0, isTextBox: true, valign: "middle" });
}

// 7. CLASS HIERARCHY
{
  const s = content("Class hierarchy", "Point at each tree. Solid arrows show 'extends' (inheritance). The dashed arrow shows 'implements' (interface). Every web page extends Page and every form handler extends Action, so adding a page means adding one class.");
  const tree = (parent, stereo, kids, x, y, w, kidW, dashed, kidsY) => {
    const pw = Math.min(2.2, w), px = x + (w - pw) / 2;
    box(s, parent, { x: px, y, w: pw, h: 0.62, fill: C.text1, color: C.background1, size: 13, mono: true, sub: stereo, subColor: C.accent2 });
    const ky = kidsY || y + 1.15, busY = (y + 0.62 + ky) / 2 + 0.05;
    const gap = (w - kids.length * kidW) / Math.max(1, kids.length - 1);
    const cxs = kids.map((k, i) => x + (kids.length === 1 ? (w - kidW) / 2 : i * (kidW + gap)) + kidW / 2);
    const lo = dashed ? { dashType: "dash" } : {};
    // vertical up to parent with arrow head at parent
    s.addShape(pres.shapes.LINE, { x: x + w / 2, y: y + 0.62, w: 0, h: busY - y - 0.62, line: Object.assign({ color: C.accent6, width: 1.5, beginArrowType: "triangle" }, lo) });
    if (kids.length > 1) line(s, cxs[0], busY, cxs[cxs.length - 1], busY, C.accent6, lo);
    kids.forEach((k, i) => {
      line(s, cxs[i], busY, cxs[i], ky, C.accent6, lo);
      box(s, k, { x: cxs[i] - kidW / 2, y: ky, w: kidW, h: 0.5, fill: C.background2, size: 11, mono: true, bold: false });
    });
  };
  tree("User", "«abstract»", ["Customer", "Admin"], 0.5, 1.1, 2.8, 1.25);
  tree("Bookable", "«interface»", ["Booking"], 3.6, 1.1, 2.8, 1.4, true);
  tree("Action", "«abstract»", ["BookAction", "CancelAction"], 6.7, 1.1, 2.8, 1.35);
  tree("Page", "«abstract»", ["HomePage", "SchedulesPage", "VenuesPage", "SeatsPage", "BookingsPage", "ProfilePage"], 0.5, 3.25, 9, 1.4, false, 4.4);
  s.addText("extends", { x: 2.0, y: 2.0, w: 0.9, h: 0.25, fontSize: 10, italic: true, color: C.accent6, margin: 0, isTextBox: true });
  s.addText("implements", { x: 5.1, y: 2.0, w: 1.1, h: 0.25, fontSize: 10, italic: true, color: C.accent6, margin: 0, isTextBox: true });
}

// =====================================================================
divider("02", "OOP Concepts", "Where each concept lives in our code", "Section 2: one slide per OOP concept, each with the real code from the project.");

// 9. AT A GLANCE
{
  const s = content("OOP concepts at a glance", "This is the summary slide. The next slides go through each row with code.");
  const rows = [
    ["Encapsulation", "Private fields behind getters/setters", "User, Event, Booking, WebRequest"],
    ["Inheritance", "Subclasses reuse a parent class", "Customer/Admin → User; 6 pages → Page"],
    ["Abstraction", "Abstract classes declare what, not how", "User, Page, Action"],
    ["Interface", "A contract a class promises to fulfil", "Booking implements Bookable"],
    ["Method overriding", "Subclass replaces parent behaviour", "getRole(), renderContent(), execute()"],
    ["Polymorphism", "One call, behaviour picked at runtime", "WebServer → page.render(), action.execute()"],
    ["Enums", "Fixed set of typed constants with data", "SeatType (with price), BookingStatus"],
    ["Template method", "Fixed algorithm, one step left to subclasses", "Page.render() → renderContent()"],
  ];
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text1 }, fontSize: 13 } });
  const data = [[hdr("Concept"), hdr("Idea"), hdr("Where in our project")]].concat(rows.map((r, i) => [
    { text: r[0], options: { bold: true, color: C.accent1, fontSize: 12.5 } },
    { text: r[1], options: { color: C.text2, fontSize: 12 } },
    { text: r[2], options: { color: C.text1, fontSize: 11, fontFace: MONO } },
  ].map(c => (c.options.fill = { color: i % 2 ? C.background1 : C.background2 }, c))));
  s.addTable(data, { x: 0.5, y: 1.08, w: 9, colW: [1.8, 3.25, 3.95], rowH: 0.43, border: { type: "none" }, valign: "middle", margin: [0, 8, 0, 8] });
}

// 10. ENCAPSULATION
{
  const s = content("Encapsulation", "Encapsulation means hiding data inside a class and only exposing safe methods. No other class can change a user's id directly. WebRequest is another example: pages call request.get(\"q\") and never see how the URL and form body are parsed.");
  s.addText("Hide the data, expose only safe methods", { x: 0.5, y: 1.1, w: 4.0, h: 0.4, fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true });
  bullets(s, [
    "Every model field is private: userId, name, email, seats, totalAmount…",
    "Other classes read data only through getters like getName()",
    "userId has no setter, so it cannot change after creation",
    "WebRequest hides URL/form parsing behind get(), getInt() and getAll()",
  ], { x: 0.5, y: 1.65, w: 4.0, h: 3.3 });
  codePanel(s, { x: 4.85, y: 1.1, w: 4.65, h: 3.95, file: "User.java", size: 11, code: `
public abstract class User {
  private int userId;     // hidden state
  private String name;
  private String email;

  public User(int userId, String name,
              String email) {
    this.userId = userId;
    this.name = name;
    this.email = email;
  }

  public int getUserId() { return userId; }
  public String getName() { return name; }

  public void setName(String name) {
    this.name = name;
  }
}` });
}

// 11. INHERITANCE
{
  const s = content("Inheritance", "Customer gets userId, name, email and all the getters from User for free. super(...) calls the parent constructor. The same idea is used heavily in the web layer: six page classes extend Page and two action classes extend Action.");
  codePanel(s, { x: 0.5, y: 1.1, w: 4.9, h: 3.95, file: "Customer.java", size: 11, code: `
public class Customer extends User {

  private ArrayList<Booking> bookings;

  public Customer(int userId, String name,
                  String email) {
    super(userId, name, email); // parent ctor
    bookings = new ArrayList<>();
  }

  @Override
  public String getRole() {
    return "Attendee";
  }
}

public class Admin extends User { ... }` });
  s.addText("Reuse a parent class, add only what's new", { x: 5.8, y: 1.1, w: 3.7, h: 0.4, fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true });
  const rows = [["2", "User subclasses", "Customer, Admin"], ["6", "Page subclasses", "Home, Schedules, Venues, Seats, Bookings, Profile"], ["2", "Action subclasses", "BookAction, CancelAction"]];
  rows.forEach(([n, t, d], i) => {
    const y = 1.7 + i * 1.12;
    card(s, { x: 5.8, y, w: 3.7, h: 0.98, name: "inherit " + t });
    s.addText(n, { x: 5.95, y, w: 0.6, h: 0.98, fontSize: 30, bold: true, color: C.accent1, margin: 0, valign: "middle", isTextBox: true });
    s.addText([{ text: t, options: { bold: true, fontSize: 14, color: C.text1, breakLine: true } }, { text: d, options: { fontSize: 11, color: C.text2 } }],
      { x: 6.6, y: y + 0.08, w: 2.8, h: 0.82, margin: 0, valign: "middle", isTextBox: true });
  });
}

// 12. ABSTRACTION
{
  const s = content("Abstraction", "An abstract class cannot be created with 'new'. It only says what every subclass must be able to do. User forces every kind of user to have a role and a profile. Page forces every web page to have a path, a title and content.");
  s.addText("Say what must be done, not how", { x: 0.5, y: 1.1, w: 3.4, h: 0.4, fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true });
  bullets(s, [
    "User, Page and Action are abstract classes and can't be created with new",
    "Abstract methods have no body; each subclass must implement them",
    "Callers only depend on the abstract type, not on the concrete page",
    [{ text: "Page also gives a default: ", options: {} }, { text: "showInNav()", options: { fontFace: MONO, fontSize: 12.5 } }, { text: " returns true", options: {} }],
  ], { x: 0.5, y: 1.65, w: 3.4, h: 3.4 });
  codePanel(s, { x: 4.2, y: 1.1, w: 5.3, h: 1.75, file: "User.java", size: 11, code: `
public abstract class User {
  // ...private fields, getters...
  public abstract void displayProfile();
  public abstract String getRole();
}` });
  codePanel(s, { x: 4.2, y: 3.0, w: 5.3, h: 2.05, file: "Page.java", size: 11, code: `
public abstract class Page {
  public abstract String getPath();
  public abstract String getTitle();
  protected abstract String renderContent(
      WebRequest request);
}` });
}

// 13. INTERFACE
{
  const s = content("Interface", "Bookable is a contract: anything bookable must be able to book seats and cancel. Booking implements it. Note the two-pass logic in bookSeats: check every seat first, then book. This means a booking is all-or-nothing. If one seat is taken, nothing is booked.");
  codePanel(s, { x: 0.5, y: 1.1, w: 4.2, h: 1.6, file: "Bookable.java", size: 11, code: `
public interface Bookable {
  boolean bookSeats(String[] seats);
  boolean cancelBooking();
}` });
  s.addText("A contract the class promises to keep", { x: 0.5, y: 2.95, w: 4.2, h: 0.4, fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true });
  bullets(s, [
    "Booking implements Bookable, so it must define both methods",
    "All-or-nothing: every seat is checked before any is booked",
    "Cancelling frees the seats back into the schedule",
  ], { x: 0.5, y: 3.45, w: 4.2, h: 1.6 });
  codePanel(s, { x: 5.0, y: 1.1, w: 4.5, h: 3.95, file: "Booking.java (simplified)", size: 10.5, code: `
public class Booking implements Bookable {
  @Override
  public boolean bookSeats(String[] seats) {
    // 1. check ALL seats are free first
    for (String seat : seats)
      if (!schedule.isSeatAvailable(seat))
        return false;
    // 2. then book every seat
    for (String seat : seats) {
      schedule.bookSeat(seat);
      selectedSeats.add(seat);
    }
    totalAmount = seats.length
                * seatType.getPrice();
    status = BookingStatus.CONFIRMED;
    return true;
  }
}` });
}

// 14. METHOD OVERRIDING
{
  const s = content("Method overriding", "Same method signature, different behaviour in each subclass. @Override asks the compiler to check we really are overriding a parent method. SeatsPage overrides showInNav() to return false, so the seat page is hidden from the top menu.");
  codePanel(s, { x: 0.5, y: 1.1, w: 2.95, h: 1.7, file: "Admin.java", size: 12, code: `
@Override
public String getRole() {
  return "Admin";
}` });
  codePanel(s, { x: 3.6, y: 1.1, w: 2.95, h: 1.7, file: "Customer.java", size: 12, code: `
@Override
public String getRole() {
  return "Attendee";
}` });
  codePanel(s, { x: 6.7, y: 1.1, w: 2.8, h: 1.7, file: "SeatsPage.java", size: 10.5, code: `
@Override
public boolean showInNav() {
  return false; // hide
}` });
  s.addText("Methods we override across the project", { x: 0.5, y: 3.15, w: 9, h: 0.35, fontSize: 15, bold: true, color: C.text1, margin: 0, isTextBox: true });
  const ms = [["getRole()", 1.25], ["displayProfile()", 1.75], ["getPath()", 1.2], ["getTitle()", 1.3], ["renderContent()", 1.75], ["execute()", 1.2], ["showInNav()", 1.4], ["bookSeats()", 1.4], ["cancelBooking()", 1.75]];
  let x = 0.5, y = 3.6;
  ms.forEach(([m, w]) => {
    if (x + w > 9.5) { x = 0.5; y += 0.5; }
    tag(s, m, { x, y, w, h: 0.38, fill: C.background2, color: C.accent1, size: 11, mono: true }); x += w + 0.12;
  });
  s.addText([{ text: "@Override", options: { fontFace: MONO, color: C.accent1, fontSize: 13 } }, { text: " asks the compiler to check that a parent method really is being replaced, so a typo in the name becomes a compile error instead of a silent bug.", options: { color: C.text2 } }],
    { x: 0.5, y: 4.4, w: 9, h: 0.6, fontSize: 14, margin: 0, isTextBox: true, valign: "top" });
}

// 15. POLYMORPHISM
{
  const s = content("Runtime polymorphism", "This is the most important slide. The WebServer has a map of Page references. When a request arrives it calls render() on whatever Page is stored for that path. Java decides at runtime which subclass's renderContent() runs. The server never uses if/else on page types. Adding a new page needs zero changes to the server's handle() method.");
  codePanel(s, { x: 0.5, y: 1.1, w: 5.35, h: 3.95, file: "WebServer.java (simplified)", size: 10.5, code: `
Map<String, Page> pagesByPath = new HashMap<>();
Map<String, Action> actionsByPath = new HashMap<>();

addPage(new HomePage(system, customer));
addPage(new SeatsPage(system, customer));
addAction(new BookAction(system, customer));

// handle(): one call, many behaviours
if (isPost && actionsByPath.containsKey(path)) {
  String next = actionsByPath.get(path)
                             .execute(request);
} else if (pagesByPath.containsKey(path)) {
  send(200, pagesByPath.get(path)
                       .render(request, pages));
}` });
  box(s, "Page page = pagesByPath.get(path)", { x: 6.15, y: 1.1, w: 3.35, h: 0.55, fill: C.text1, color: C.background1, size: 10.5, mono: true });
  const targets = [["/", "HomePage"], ["/seats", "SeatsPage"], ["/bookings", "BookingsPage"], ["/profile", "ProfilePage"]];
  line(s, 6.45, 1.65, 6.45, 1.97 + 3 * 0.55 + 0.21, C.accent6);
  targets.forEach(([p, c], i) => {
    const y = 1.97 + i * 0.55;
    arrow(s, 6.45, y + 0.21, 6.8, y + 0.21, C.accent6);
    box(s, c + ".renderContent()", { x: 6.8, y, w: 2.7, h: 0.42, fill: C.background2, size: 10.5, mono: true, bold: false, color: C.text1 });
  });
  s.addText([
    { text: "Also in ProfilePage: ", options: { bold: true, color: C.text1 } },
    { text: "User user = customer;  user.getRole()", options: { fontFace: MONO, color: C.accent1, fontSize: 11 } },
    { text: " returns \"Attendee\", the Customer version.", options: { color: C.text2 } },
  ], { x: 6.15, y: 4.25, w: 3.35, h: 0.8, fontSize: 12, margin: 0, valign: "top", isTextBox: true });
}

// 16. ENUMS
{
  const s = content("Enums", "Enums are type-safe constants. SeatType goes further and stores a price in each constant, so the price can never be mistyped anywhere else. SeatType.values() builds the radio buttons on the seat page, and SeatType.valueOf() turns the submitted form value back into an enum.");
  codePanel(s, { x: 0.5, y: 1.1, w: 4.6, h: 3.95, file: "SeatType.java  ·  BookingStatus.java", size: 11, code: `
public enum SeatType {
  REGULAR(199),
  PREMIUM(349),
  VIP(599);

  private final double price;

  SeatType(double price) {
    this.price = price;
  }
  public double getPrice() { return price; }
}

public enum BookingStatus {
  CONFIRMED, CANCELLED
}` });
  const tickets = [["REGULAR", "₹199", C.accent3], ["PREMIUM", "₹349", C.accent5], ["VIP", "₹599", C.accent2]];
  tickets.forEach(([n, p, col], i) => {
    const x = 5.4 + i * 1.4;
    card(s, { x, y: 1.1, w: 1.27, h: 1.25, fill: col, name: "ticket " + n });
    s.addText(n, { x, y: 1.2, w: 1.27, h: 0.35, fontSize: 12, bold: true, color: C.background1, align: "center", margin: 0, isTextBox: true });
    s.addText(p, { x, y: 1.55, w: 1.27, h: 0.6, fontSize: 24, bold: true, color: C.background1, align: "center", margin: 0, isTextBox: true });
  });
  s.addText([
    { text: "total = seats × seatType.getPrice()", options: { fontFace: MONO, color: C.text1, fontSize: 12, breakLine: true } },
    { text: "e.g. 2 VIP seats = 2 × 599 = ₹1198", options: { color: C.text2 } },
  ], { x: 5.4, y: 2.55, w: 4.1, h: 0.65, fontSize: 13, margin: 0, isTextBox: true, valign: "top" });
  bullets(s, [
    [{ text: "SeatType.values()", options: { fontFace: MONO, fontSize: 12.5 } }, { text: " builds the ticket radio buttons", options: {} }],
    [{ text: "SeatType.valueOf(...)", options: { fontFace: MONO, fontSize: 12.5 } }, { text: " reads the form choice", options: {} }],
    "BookingStatus drives the green/red badge on each ticket",
  ], { x: 5.4, y: 3.4, w: 4.1, h: 1.65, fontSize: 13 });
}

// 17. TEMPLATE METHOD
{
  const s = content("Template method pattern", "render() is final: no subclass can change the common layout. It builds the page skeleton and calls the abstract renderContent() hook for the one part that differs. That is why all pages look the same and each page class is only 30 to 60 lines.");
  codePanel(s, { x: 0.5, y: 1.1, w: 5.6, h: 3.95, file: "Page.java (simplified)", size: 10.5, code: `
public final String render(WebRequest request,
                           List<Page> navPages) {
  StringBuilder nav = new StringBuilder();
  for (Page page : navPages) {
    if (!page.showInNav()) continue;
    nav.append("<a href=...>" + page.getTitle());
  }
  return "<!doctype html>..." + STYLES
    + "<header>" + nav + "</header>"
    + "<h1>" + esc(getTitle()) + "</h1>"
    + message
    + renderContent(request) // subclass decides
    + "</main></body></html>";
}` });
  const steps = [["<head> + shared CSS", false], ["Header + navigation", false], ["Page title + message", false], ["renderContent()", true], ["Closing tags", false]];
  s.addText("Every page response", { x: 6.4, y: 1.1, w: 3.1, h: 0.3, fontSize: 13, bold: true, color: C.text1, margin: 0, isTextBox: true });
  steps.forEach(([t, hot], i) => {
    const y = 1.5 + i * 0.62;
    box(s, t, { x: 6.4, y, w: 3.1, h: 0.5, fill: hot ? C.accent1 : C.background2, color: hot ? C.background1 : C.text1, size: hot ? 12 : 12, bold: hot, mono: hot });
  });
  s.addText("Grey = fixed in Page (final).  Coral = differs per subclass.", { x: 6.4, y: 4.65, w: 3.1, h: 0.42, fontSize: 10.5, color: C.accent6, margin: 0, isTextBox: true, valign: "top" });
}

// 18. MORE JAVA FEATURES
{
  const s = content("More Java features we used", "Quick tour of other Java features. Method overloading is compile-time polymorphism: two get() methods with different parameters. Exceptions keep bad input from crashing the server.");
  const cards = [
    ["Method overloading", "get(String key)\nget(String key, String def)", "Same name, different parameters, chosen at compile time"],
    ["Collections", "Map<String, Boolean> seats\n  = new HashMap<>();", "A1→true means free. ArrayList stores events and bookings"],
    ["Exception handling", "try { Integer.parseInt(v); }\ncatch (NumberFormatException e)", "Bad input shows a friendly message, never a crash"],
    ["static & final", "static final char FIRST_ROW\nfinal String render(...)", "Shared constants, and a method subclasses can't override"],
    ["Lambdas & method refs", "this::handle  // method ref\nk -> new ArrayList<>()", "Pass behaviour as a value"],
    ["Access modifiers", "private  ·  protected  ·  public", "Page's protected system and customer fields are visible only to subclasses"],
  ];
  cards.forEach(([t, code, d], i) => {
    const x = 0.5 + (i % 3) * 3.05, y = 1.1 + Math.floor(i / 3) * 2.0;
    card(s, { x, y, w: 2.9, h: 1.85, name: "feature " + t });
    s.addText(t, { x: x + 0.15, y: y + 0.12, w: 2.6, h: 0.32, fontSize: 14, bold: true, color: C.accent1, margin: 0, isTextBox: true });
    s.addText(code, { x: x + 0.15, y: y + 0.5, w: 2.7, h: 0.55, fontSize: 9.5, fontFace: MONO, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
    s.addText(d, { x: x + 0.15, y: y + 1.08, w: 2.6, h: 0.7, fontSize: 11.5, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
  });
}

// =====================================================================
divider("03", "Website Demo", "From an HTTP request to a booked seat", "Section 3: the running website. If you can, run ./run.sh and show it live; these screenshots are the backup.");

// 20. REQUEST FLOW
{
  const s = content("How a request flows", "GET requests are answered by a Page. POST requests (form submits) are handled by an Action, which redirects the browser to a page with a success or error message. This Post/Redirect/Get pattern stops a booking being repeated if the user refreshes. The server is single-threaded, so two people can never book the same seat at the same moment.");
  box(s, "Browser", { x: 0.5, y: 1.55, w: 1.45, h: 0.9, fill: C.background1, lineColor: C.accent6 });
  arrow(s, 1.95, 2.0, 2.45, 2.0);
  box(s, "WebServer", { x: 2.45, y: 1.55, w: 1.75, h: 0.9, fill: C.text1, color: C.background1, mono: true, size: 12, sub: "handle()", subColor: C.accent2 });
  arrow(s, 4.2, 1.85, 4.85, 1.38, C.accent3); arrow(s, 4.2, 2.15, 4.85, 2.62, C.accent1);
  s.addText("GET", { x: 4.1, y: 1.3, w: 0.6, h: 0.25, fontSize: 10, bold: true, color: C.accent3, margin: 0, isTextBox: true });
  s.addText("POST", { x: 4.1, y: 2.45, w: 0.6, h: 0.25, fontSize: 10, bold: true, color: C.accent1, margin: 0, isTextBox: true });
  box(s, "page.render()", { x: 4.85, y: 1.1, w: 2.1, h: 0.56, fill: "E6EEFB", mono: true, size: 12 });
  box(s, "action.execute()", { x: 4.85, y: 2.34, w: 2.1, h: 0.56, fill: "FDECEC", mono: true, size: 12 });
  arrow(s, 6.95, 1.38, 7.35, 1.38); arrow(s, 6.95, 2.62, 7.35, 2.62);
  box(s, "200 OK + HTML", { x: 7.35, y: 1.1, w: 2.15, h: 0.56, fill: C.background2, size: 12 });
  box(s, "303 redirect + ?msg", { x: 7.35, y: 2.34, w: 2.15, h: 0.56, fill: C.background2, size: 12 });
  const ex = [
    ["GET /seats?id=303", "SeatsPage draws the seat map for show 303", C.accent3],
    ["POST /book", "BookAction books the seats, then redirects to /bookings with a message", C.accent1],
    ["GET /unknown", "No Page matches, so the server sends a 404 page", C.accent6],
  ];
  ex.forEach(([r, d, col], i) => {
    const x = 0.5 + i * 3.05;
    card(s, { x, y: 3.25, w: 2.9, h: 1.8, name: "example " + r });
    s.addText(r, { x: x + 0.15, y: 3.4, w: 2.65, h: 0.32, fontSize: 12, bold: true, fontFace: MONO, color: col, margin: 0, isTextBox: true });
    s.addText(d, { x: x + 0.15, y: 3.8, w: 2.6, h: 1.1, fontSize: 13, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
  });
}

// screenshot slides: image left, explanation right
function demo(title, file, pxW, pxH, imgW, tagline, items, notes, code) {
  const s = content(title, notes);
  const h = shot(s, file, { x: 0.5, y: 1.12, w: imgW, pxW, pxH, name: title + " screenshot" });
  const x = 0.5 + imgW + 0.4, w = 9.5 - x;
  s.addText(tagline, { x, y: 1.1, w, h: 0.65, fontSize: 15, italic: true, color: C.accent1, margin: 0, isTextBox: true, valign: "top" });
  bullets(s, items, { x, y: 1.85, w, h: code ? 1.7 : 3.2, fontSize: 13 });
  if (code) codePanel(s, Object.assign({ x, w }, code));
  return s;
}

demo("Events page: browse and search", "home.png", 980, 801, 4.85, "HomePage extends Page",
  [
    [{ text: "Search box and category list call ", options: {} }, { text: "system.findEvents(q, category)", options: { fontFace: MONO, fontSize: 11.5 } }],
    "Categories are built from the data, not hard-coded",
    "Every show lists live seats left and a Book button",
    "User input is escaped with esc() before it goes into HTML",
  ],
  "Show search by name (type 'food') and the category filter (Music Concert). The seats-left count comes from EventSchedule.getAvailableSeatCount().");

demo("Seat map: pick seats and ticket type", "seats.png", 980, 714, 4.85, "SeatsPage loops over EventSchedule's seats",
  [
    "4 rows × 5 seats come from static constants FIRST_ROW, LAST_ROW, SEATS_PER_ROW",
    "Booked seats are disabled checkboxes, so they can't be picked",
    "Ticket types come from SeatType.values()",
  ],
  "A1, A2 and B3 were booked earlier so they are greyed out. Explain the loop that draws the grid and how disabled seats are decided.",
  { y: 3.55, h: 1.5, file: "SeatsPage.java", size: 11, code: `
String disabled =
  schedule.isSeatAvailable(seat)
    ? "" : " disabled";` });

demo("My Bookings: tickets and cancellation", "bookings.png", 980, 845, 4.45, "BookingsPage reads customer.getBookings()",
  [
    "Newest booking is shown first, with seats, type and total",
    "Green or red badge comes from the BookingStatus enum",
    "Cancel posts to /cancel, CancelAction calls booking.cancelBooking() and frees the seats",
    "Flash message comes from the redirect's ?msg= parameter",
  ],
  "Booking #1003 was just made (PREMIUM, 3 seats = ₹1047). #1001 was cancelled, so it shows a red CANCELLED badge and no cancel button.");

// collage slide
{
  const s = content("Schedules, venues and profile", "Schedules shows every show with seats left out of 20. Venues is a simple table. Profile reads the Customer through a User reference (polymorphism) and totals confirmed bookings.");
  const h1 = shot(s, "schedules.png", { x: 0.5, y: 1.12, w: 5.2, pxW: 980, pxH: 399, name: "Schedules page screenshot" });
  s.addText([{ text: "SchedulesPage  ", options: { bold: true, color: C.text1, fontFace: MONO, fontSize: 11 } }, { text: "seats left and a Select seats link for each show", options: { color: C.text2 } }],
    { x: 0.5, y: 1.12 + h1 + 0.12, w: 5.2, h: 0.3, fontSize: 11.5, margin: 0, isTextBox: true });
  const h2 = shot(s, "venues.png", { x: 0.5, y: 3.95, w: 3.2, pxW: 980, pxH: 255, name: "Venues page screenshot" });
  s.addText([{ text: "VenuesPage", options: { bold: true, fontFace: MONO, fontSize: 11, color: C.text1 } }], { x: 3.85, y: 3.95, w: 1.85, h: 0.3, margin: 0, isTextBox: true });
  s.addText("All venues in a table", { x: 3.85, y: 4.27, w: 1.85, h: 0.5, fontSize: 11.5, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
  const h3 = shot(s, "profile.png", { x: 6.05, y: 1.12, w: 3.45, pxW: 980, pxH: 332, name: "Profile page screenshot" });
  s.addText([{ text: "ProfilePage", options: { bold: true, fontFace: MONO, fontSize: 11, color: C.text1, breakLine: true } },
    { text: "Role badge comes from user.getRole(). The stats are calculated from the customer's bookings.", options: { color: C.text2 } }],
    { x: 6.05, y: 1.12 + h3 + 0.15, w: 3.45, h: 1.0, fontSize: 11.5, margin: 0, isTextBox: true, valign: "top" });
  card(s, { x: 6.05, y: 3.55, w: 3.45, h: 1.5, name: "profile stats" });
  s.addText([
    { text: "Profile after demo", options: { bold: true, color: C.text1, breakLine: true } },
    { text: "2 confirmed  ·  1 cancelled", options: { color: C.text2, breakLine: true } },
    { text: "₹2245 spent", options: { bold: true, color: C.accent1, fontSize: 22 } },
  ], { x: 6.25, y: 3.65, w: 3.1, h: 1.3, fontSize: 13, margin: 0, isTextBox: true, valign: "middle" });
}

// validation + tests
{
  const s = content("Validation and testing", "Every case in this table was tested in the browser and with HTTP requests. The screenshot shows what happens if someone tries to book a seat that is already taken. The whole booking is rejected and nothing changes.");
  shot(s, "error.png", { x: 0.5, y: 1.12, w: 3.9, pxW: 980, pxH: 768, name: "Booking rejected error message screenshot" });
  const rows = [
    ["Search \"food\"", "Only Bangalore Food Festival"],
    ["Book A1, A2 as VIP", "#1001 confirmed, ₹1198"],
    ["Book A2 again", "Rejected: seat not available"],
    ["Submit with no seats", "Rejected: select a seat"],
    ["Cancel #1001", "CANCELLED, seats freed"],
    ["Unknown URL", "404 Page not found"],
  ];
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text1 }, fontSize: 12.5 } });
  s.addTable([[hdr("Test"), hdr("Result")]].concat(rows.map((r, i) => r.map((t, j) => ({ text: t, options: { fontSize: 12, color: j ? C.text1 : C.text2, bold: false, fill: { color: i % 2 ? C.background1 : C.background2 } } })))),
    { x: 4.75, y: 1.12, w: 4.75, colW: [2.1, 2.65], rowH: 0.48, border: { type: "none" }, valign: "middle", margin: [0, 8, 0, 8] });
  s.addText("All tests passed", { x: 4.75, y: 4.6, w: 4.75, h: 0.35, fontSize: 14, bold: true, color: C.accent4, margin: 0, isTextBox: true });
}

// console version
{
  const s = content("Bonus: the console version still works", "We first built a menu-driven console app. When we built the website we reused the same business classes unchanged. That shows the benefit of separating logic from the user interface.");
  codePanel(s, { x: 0.5, y: 1.1, w: 4.6, h: 3.95, file: "java Main", size: 10, plain: true, code: `
BOOKING SUCCESSFUL!
========================================
          EVENT TICKET
========================================
Booking ID : 1001
Attendee   : Suyash
Event      : Tech Innovators Summit
Venue      : Orion Convention Hall
Date       : 10-10-2026
Time       : 10:00 AM
Seat Type  : VIP
Seats      : [A1, A2]
Amount     : ₹1198.0
Status     : CONFIRMED` });
  s.addText("Same classes, two front ends", { x: 5.45, y: 1.1, w: 4.05, h: 0.4, fontSize: 16, italic: true, color: C.accent1, margin: 0, isTextBox: true });
  bullets(s, [
    "Main.java: Scanner + switch menu with 10 options",
    "Calls the same EventManagementSystem.createBooking()",
    "displayBooking(), displaySeats() and displayProfile() print to the terminal",
    "The website only added a layer on top. No business class was rewritten",
  ], { x: 5.45, y: 1.65, w: 4.05, h: 3.4 });
}

// =====================================================================
section = "Conclusion";
pres.addSection({ title: "Conclusion" });
{
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: section });
  s.addText("Conclusion", { x: 0.6, y: 0.4, w: 8.8, h: 0.7, fontSize: 36, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const col = (x, head, items, color) => {
    s.addText(head, { x, y: 1.35, w: 4.1, h: 0.4, fontSize: 18, bold: true, color, margin: 0, isTextBox: true });
    s.addText(items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1 } })),
      { x, y: 1.9, w: 4.1, h: 3.2, fontSize: 14, color: "E4E6F0", paraSpaceAfter: 9, margin: 0, valign: "top", isTextBox: true });
  };
  col(0.6, "What we learned", [
    "Applying encapsulation, inheritance, abstraction, interfaces, overriding and polymorphism in a real app",
    "How a web server handles requests and responses",
    "Keeping logic separate from the UI let us add a website without rewriting the logic",
    "New features are just new subclasses",
  ], C.accent2);
  col(5.3, "Future enhancements", [
    "User registration and login for many attendees",
    "MySQL database so bookings persist",
    "Admin dashboard built on the existing Admin class",
    "Online payments and e-mail tickets",
  ], C.accent1);
  s.addNotes("Summarise what we learned and what we would add next. The Admin class already exists, so an admin dashboard is a natural next step.");
}
{
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: section });
  s.addText("Thank you", { x: 0.6, y: 1.5, w: 8.8, h: 1.0, fontSize: 48, bold: true, color: C.background1, margin: 0, isTextBox: true });
  s.addText("Questions?", { x: 0.6, y: 2.5, w: 8.8, h: 0.6, fontSize: 24, color: C.accent1, margin: 0, isTextBox: true });
  s.addText("Suyash Anupam  ·  Shetty Ashvij Udaya  ·  Shamith Raghavendra Prasad", { x: 0.6, y: 3.6, w: 8.8, h: 0.4, fontSize: 14, color: "C9CBE0", margin: 0, isTextBox: true });
  s.addText("Guide: Prof. Murugan S  ·  Dept. of CSE, RVITM", { x: 0.6, y: 4.0, w: 8.8, h: 0.4, fontSize: 12, color: "9AA0B8", margin: 0, isTextBox: true });
  s.addNotes("Open the floor for questions. Likely questions: why no framework, how double booking is prevented (all-or-nothing check plus a single-threaded server), and the difference between overriding and overloading.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
