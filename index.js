app.post("/bugs", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    const bugs = JSON.parse(data || "[]");
    const { text, user } = req.body;

    if (!text || !user) {
      return res.status(400).json({ error: "Text oder Benutzer fehlt!" });
    }

    bugs.push({ text, user });

    fs.writeFile(FILE_PATH, JSON.stringify(bugs, null, 2), err => {
      if (err) return res.status(500).json({ error: "Fehler beim Schreiben der Datei." });
      res.json({ success: true });
    });
  });
});
