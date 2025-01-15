const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Endpoint para obtener trailer por título
app.get("/trailer/:title", async (req, res) => {
  const { title } = req.params;
  const url = `https://aiotube.deta.dev/search/video/${encodeURIComponent(title)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // Verificar si la respuesta contiene la URL del trailer
    if (result && result.url) {
      res.json({ url: result.url });
      console.log(`Trailer found: ${result.url}`);
    } else {
      res.status(404).json({ error: "Trailer not found" });
      console.log("Trailer not found");
    }
  } catch (error) {
    console.error(`Error fetching trailer: ${error}`);
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
