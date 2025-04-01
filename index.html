const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// این خط باعث میشه فایل‌های استاتیک (مثل index.html) نمایش داده بشن
app.use(express.static(path.join(__dirname, ".")));

const FILE_PATH = "./bugs.json";

// نمایش صفحه‌ی HTML در آدرس /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// دریافت لیست باگ‌ها
app.get("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Fehler beim Lesen der Datei." });
    res.json(JSON.parse(data || "[]"));
  });
});

// ذخیره‌سازی باگ جدید
app.post("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    const bugs = JSON.parse(data || "[]");
    bugs.push({
      text: req.body.text,
      user: req.body.user,
      comments: []
    });
    fs.writeFile(FILE_PATH, JSON.stringify(bugs, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Fehler beim Speichern." });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
