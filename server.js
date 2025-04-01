const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = "./bugs.json";

app.use(cors());
app.use(express.json());

// نمایش فایل index.html به‌عنوان صفحه‌ی اصلی
app.use(express.static(path.join(__dirname, ".")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// دریافت لیست باگ‌ها
app.get("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Fehler beim Lesen der Datei." });
    try {
      const bugs = JSON.parse(data || "[]");
      res.json(bugs);
    } catch (e) {
      res.status(500).json({ error: "Fehler beim Parsen der Datei." });
    }
  });
});

// ثبت باگ جدید
app.post("/bugs", (req, res) => {
  const { text, user } = req.body;
  if (!text || !user) {
    return res.status(400).json({ error: "Fehlerbeschreibung oder Benutzer fehlt!" });
  }

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    let bugs = [];
    if (!err && data) {
      try {
        bugs = JSON.parse(data);
      } catch (e) {
        console.error("Fehler beim Parsen:", e);
      }
    }

    const newBug = { text, user, comments: [] };
    bugs.push(newBug);

    fs.writeFile(FILE_PATH, JSON.stringify(bugs, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Fehler beim Speichern der Datei." });
      res.json({ success: true });
    });
  });
});

// اجرای سرور
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
