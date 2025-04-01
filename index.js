const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// مسیر فایل bugs
const FILE_PATH = "./bugs.json";

// نمایش فایل HTML در صفحه اصلی
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// دریافت لیست باگ‌ها
app.get("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "خطا در خواندن فایل باگ‌ها" });
    res.json(JSON.parse(data || "[]"));
  });
});

// ثبت باگ جدید
app.post("/bugs", (req, res) => {
  fs.writeFile(FILE_PATH, JSON.stringify(req.body), (err) => {
    if (err) return res.status(500).json({ error: "خطا در ذخیره‌سازی باگ‌ها" });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
