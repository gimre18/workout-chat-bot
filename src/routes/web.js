import express from "express";
import { postWebhook, getWebhook} from "../controllers/chatBotController.js";


let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", getHomepage);
    router.get("/webhook", getWebhook);
    router.post("/webhook", postWebhook);
    return app.use("/", router);
};

export { initWebRoutes };