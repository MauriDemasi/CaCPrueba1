const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/trailer/:title", async (req, res) => {
  const { title } = req.params;
  const url = `https://aiotube.deta.dev/search/video/${encodeURIComponent(
    title
  )}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // Envía la URL del trailer como respuesta
    if (result && result.url) {
      res.json({ url: result.url });
      console.log(result.url);
    } else {
      res.status(404).json({ error: "Trailer not found" });
      console.log("Trailer not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//ENDPOINT DE PRUEBA PARA POSTMAN
app.get("/test", (req, res) => {
  res.send("Hola mundo");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
