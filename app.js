require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger");

const app = express();

app.enable("trust proxy");
app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Budgety Adventure API Docs",
  swaggerOptions: { persistAuthorization: true },
}));

require("./src/routes")(app);
require("./src/middlewares/error")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server is running");
});

const DB =
  process.env.NODE_ENV === "development" ? process.env.DATABASE_LOCAL : process.env.DATABASE;

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err.message));
