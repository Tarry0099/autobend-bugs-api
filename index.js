const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, "bugs.json"); // مسیر کامل بهتر است

app.use(cors());
app.use(express.json());

// نمایش فایل index.html به‌عنوان صفحه‌ی اصلی
app.use(express.static(path.join(__dirname, ".")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// تابع کمکی برای خواندن فایل JSON
function readBugs(callback) {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) {
      // اگر فایل وجود نداشت یا خطای دیگری بود، آرایه خالی برگردان
      if (err.code === 'ENOENT') {
        return callback(null, []);
      }
      return callback(err);
    }
    try {
      const bugs = JSON.parse(data || "[]");
      callback(null, bugs);
    } catch (e) {
      console.error("Error parsing bugs.json:", e);
      callback(e);
    }
  });
}

// تابع کمکی برای نوشتن فایل JSON
function writeBugs(bugs, callback) {
  fs.writeFile(FILE_PATH, JSON.stringify(bugs, null, 2), "utf8", (err) => {
    callback(err);
  });
}

// دریافت لیست باگ‌ها
app.get("/bugs", (req, res) => {
  readBugs((err, bugs) => {
    if (err) return res.status(500).json({ error: "Fehler beim Lesen der Datei." });
    res.json(bugs);
  });
});

// ثبت باگ جدید
app.post("/bugs", (req, res) => {
  const { text, user } = req.body;
  if (!text || !user) {
    return res.status(400).json({ error: "Fehlerbeschreibung oder Benutzer fehlt!" });
  }

  readBugs((err, bugs) => {
    if (err) return res.status(500).json({ error: "Fehler beim Lesen der Datei für das Hinzufügen." });

    // پیدا کردن بزرگترین ID موجود و +۱ کردن آن یا شروع از ۱ اگر لیست خالی است
    const newId = bugs.length > 0 ? Math.max(...bugs.map(b => b.id || 0)) + 1 : 1;

    const newBug = {
      id: newId, // <<<<<<< اضافه کردن ID
      text,
      user,
      erledigt: false, // <<<<<<< اضافه کردن وضعیت اولیه
      erledigtVon: null, // <<<<<<< اضافه کردن نام انجام دهنده اولیه
      // comments: [] // اگر نیاز نیست می‌توان حذف کرد
    };
    bugs.push(newBug);

    writeBugs(bugs, (err) => {
      if (err) return res.status(500).json({ error: "Fehler beim Speichern der Datei." });
      // باگ جدید را به همراه لیست کامل یا فقط پیام موفقیت برگردانید
      // برگرداندن باگ جدید بهتر است تا فرانت‌اند مجبور به لود مجدد کل لیست نباشد
      res.status(201).json(newBug); 
    });
  });
});

// <<<<<<< مسیر جدید: علامت زدن باگ به عنوان انجام شده >>>>>>>
app.put("/bugs/:id/erledigt", (req, res) => {
  const bugId = parseInt(req.params.id, 10); // ID از پارامتر URL گرفته و به عدد تبدیل می‌شود
  const { erledigtVonUser } = req.body; // نام کاربری که باگ را انجام داده از بدنه درخواست

  if (isNaN(bugId)) {
      return res.status(400).json({ error: "Ungültige Bug-ID." });
  }
  if (!erledigtVonUser) {
      return res.status(400).json({ error: "Benutzername für 'Erledigt' fehlt." });
  }

  readBugs((err, bugs) => {
      if (err) return res.status(500).json({ error: "Fehler beim Lesen der Datei für Update." });

      const bugIndex = bugs.findIndex(bug => bug.id === bugId);

      if (bugIndex === -1) {
          return res.status(404).json({ error: "Bug nicht gefunden." });
      }

      // به‌روزرسانی وضعیت باگ
      bugs[bugIndex].erledigt = true;
      bugs[bugIndex].erledigtVon = erledigtVonUser;

      writeBugs(bugs, (err) => {
          if (err) return res.status(500).json({ error: "Fehler beim Speichern der Datei nach Update." });
          // باگ آپدیت شده را برگردانید
          res.json(bugs[bugIndex]);
      });
  });
});


// اجرای سرور
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // آدرس دقیق‌تر
});
