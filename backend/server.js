import express from "express";
import logger from "./middleware/logger";

const Port = process.env.PORT || 8081;

const app = express();

app.use(express.json());
app.use(logger);

app.listen(Port, () => {
  console.log(`Server is running on Port: ${Port}`);
});
