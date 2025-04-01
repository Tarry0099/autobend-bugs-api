const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./bugs.json";

// دریافت لیست کامل باگ‌ها
app.get("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "خطا در خواندن فایل" });
    res.json(JSON.parse(data || "[]"));
  });
});

// ثبت یک باگ جدید
app.post("/bugs", (req, res) => {
  const { text, user } = req.body;
  if (!text || !user) return res.status(400).json({ error: "اطلاعات ناقص است" });

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    let bugs = [];
    if (!err && data) bugs = JSON.parse(data);

    const newBug = { text, user, comments: [] };
    bugs.push(newBug);

    fs.writeFile(FILE_PATH, JSON.stringify(bugs, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "خطا در ذخیره‌سازی" });
      res.json({ success: true });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Autobend Bugs API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
