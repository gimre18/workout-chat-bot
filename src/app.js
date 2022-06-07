import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import { initWebRoutes } from "./routes/web.js";

dotenv.config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Running, port: ${port}`);
});