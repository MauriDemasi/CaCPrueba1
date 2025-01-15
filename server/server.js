const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/trailer/:title", async (req, res) => {
  const { title } = req.params;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    title + " trailer"
  )}`;

  try {
    // Hace la solicitud al HTML de YouTube
    const response = await axios.get(searchUrl);

    // Busca los enlaces de videos con expresiones regulares
    const videoMatch = response.data.match(/\/watch\?v=[\w-]+/);
    if (videoMatch) {
      const videoUrl = `https://www.youtube.com${videoMatch[0]}`;
      return res.json({ url: videoUrl });
    }

    res.status(404).json({ error: "Trailer not found" });
  } catch (error) {
    console.error("Error fetching trailer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint de prueba
app.get("/test", (req, res) => {
  res.send("Hola mundo");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
