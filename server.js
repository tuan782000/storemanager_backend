import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const PORT = 7820;

app.get("/auth/login", (_req, res) => {
  res.send(`<h1>Hello users server running on port ${PORT}</h1>`);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server running http://localhost:${PORT}`);
});
