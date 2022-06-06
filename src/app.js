import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import { initWebRoutes } from "./routes/web.js"

dotenv.config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.set("view engine", "ejs");
app.set("views","./src/views");

initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Running, port: ${port}`);
});