import express from "express";
import path from "path";
const __dirname = path.resolve();
const app = express();
const port = 8100;

app.use((req, res, next) => {
  res.append("Cross-Origin-Embedder-Policy", "require-corp");
  res.append("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});
app.get("/*", (req, res) => {
  res.sendFile(__dirname + `/dist/${req.url}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
