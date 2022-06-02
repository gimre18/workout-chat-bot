import express from "express";
import bodyParser from "body-parser";

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = 8080;

app.listen(port, () => {
    console.log(`Running, port: ${port}`);
});