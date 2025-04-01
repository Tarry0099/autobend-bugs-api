const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./bugs.json";

// روت اصلی برای تست
app.get("/", (req, res) => {
  res.send("Autobend Bugs API is running 🚀");
});

// خواندن لیست باگ‌ها
app.get("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "خطا در خواندن فایل" });
    res.json(JSON.parse(data || "[]"));
  });
});

// ذخیره‌سازی لیست باگ‌ها
app.post("/bugs", (req, res) => {
  fs.writeFile(FILE_PATH, JSON.stringify(req.body), (err) => {
    if (err) return res.status(500).json({ error: "خطا در ذخیره‌سازی فایل" });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
