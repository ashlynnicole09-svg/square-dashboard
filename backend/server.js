import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = "https://connect.squareup.com/v2";
const SQUARE_TOKEN = process.env.SQUARE_TOKEN;
const LOCATION_ID = process.env.SQUARE_LOCATION_ID;

async function squareFetch(endpoint, method = "GET", body = null) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method,
    headers: {
      "Authorization": `Bearer ${SQUARE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });
  return res.json();
}

// Get customers
app.get("/customers", async (req, res) => {
  res.json(await squareFetch("customers"));
});

// Get catalog items
app.get("/items", async (req, res) => {
  res.json(await squareFetch("catalog/list"));
});

// Get open orders (tickets)
app.get("/orders", async (req, res) => {
  const body = {
    location_ids: [LOCATION_ID],
    query: {
      filter: { state_filter: { states: ["OPEN"] } }
    }
  };
  res.json(await squareFetch("orders/search", "POST", body));
});

// Get single order details
app.get("/orders/:id", async (req, res) => {
  res.json(await squareFetch(`orders/${req.params.id}`));
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
