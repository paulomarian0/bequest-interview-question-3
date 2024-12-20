import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
app.use(cors());
app.use(express.json());

let database = {
  data: "Hi Bequest! :)",
  hash: "",
};

const generateHash = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

database.hash = generateHash(database.data);
const backup = { ...database };

app.get("/recover", (_, res) => {
  database = { ...backup };
  console.log({ database, backup });
  res.json(database);
});

app.get("/", (_, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  const { data } = req.body;
  if (typeof data !== "string") {
    return res.status(400).json({ error: "Invalid data format" });
  }

  database.data = data;
  database.hash = generateHash(data);

  res.sendStatus(200);
});

app.post("/verify", (req, res) => {
  const { data } = req.body;
  if (typeof data !== "string") {
    return res.status(400).json({ status: "Invalid data format" });
  }

  const receivedHash = generateHash(data);
  console.log({ receivedHash, databaseHash: database.hash });

  if (receivedHash === database.hash) {
    res.json({ status: "The data is valid." });
  } else {
    res.json({ status: "The data has been tampered." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
