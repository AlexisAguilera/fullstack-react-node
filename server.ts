import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const BASE_URL_GEOCODE =
  "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";

app.get("/api/geocode", async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    const response = await axios.get(
      `${BASE_URL_GEOCODE}?address=${address}&benchmark=Public_AR_Current&format=json`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const BASE_URL_WEATHER = "https://api.weather.gov";
app.get("/api/weather", async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;
    const forecastResponse = await axios.get(
      `${BASE_URL_WEATHER}/points/${latitude},${longitude}`,
      {
        headers: {
          "User-Agent": "AlexisAguileraApp",
        },
      }
    );
    const forecastURL = forecastResponse.data.properties.forecast;

    const response = await axios.get(forecastURL);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
