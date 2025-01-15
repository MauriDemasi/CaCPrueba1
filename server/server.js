const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer"); // Importa Puppeteer

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/trailer/:title", async (req, res) => {
  const { title } = req.params;
  
  try {
    // Llama a la función para obtener el trailer de YouTube
    const trailerUrl = await getTrailerFromYouTube(title);

    if (trailerUrl) {
      res.json({ url: trailerUrl });
    } else {
      res.status(404).json({ error: "Trailer not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Función que obtiene el trailer de YouTube a través de Puppeteer
async function getTrailerFromYouTube(movieTitle) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navega a YouTube y realiza la búsqueda
  await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle)}+trailer`);
  
  // Extrae la URL del primer video de la lista de resultados
  const trailerUrl = await page.evaluate(() => {
    const firstVideo = document.querySelector('a#video-title');
    return firstVideo ? `https://www.youtube.com${firstVideo.getAttribute('href')}` : null;
  });

  await browser.close();

  return trailerUrl;
}

// Endpoint de prueba
app.get("/test", (req, res) => {
  res.send("Hola mundo");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
