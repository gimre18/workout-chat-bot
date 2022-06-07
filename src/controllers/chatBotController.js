import dotenv from 'dotenv';
dotenv.config();
import request from 'request';
import * as chatbotService from "../services/chatBotService.js";
import * as dataService from "../services/dataService.js";
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN;
    console.log(VERIFY_TOKEN);
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

// Handles messages events
let handleMessage = async (sender_psid, received_message) => {
    let response;

    // Check if the message contains text
    if (received_message.text) {
        dataService.resetWorkout();
        await chatbotService.sendGreeting(sender_psid);

    } else if (received_message.attachments) {
        // // Gets the URL of the message attachment
        // let attachment_url = received_message.attachments[0].payload.url;
        // response = {
        //     "attachment": {
        //         "type": "template",
        //         "payload": {
        //             "template_type": "generic",
        //             "elements": [{
        //                 "title": "Is this the right picture?",
        //                 "subtitle": "Tap a button to answer.",
        //                 "image_url": attachment_url,
        //                 "buttons": [
        //                     {
        //                         "type": "postback",
        //                         "title": "Yes!",
        //                         "payload": "yes",
        //                     },
        //                     {
        //                         "type": "postback",
        //                         "title": "No!",
        //                         "payload": "no",
        //                     }
        //                 ],
        //             }]
        //         }
        //     }
        // }
    }
}

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload.split(':');

    switch (payload[0]) {
        case "GREETING":
            if (received_postback.title == "YES") {
                let exec = dataService.getExercise();
                await chatbotService.sendReadyNextExercise(sender_psid, exec);
            } else {
                await chatbotService.sendStopWorkout(sender_psid);
            }
            break;
        case "STOPWORKOUT":
            if (received_postback.title == "YES") {
                await chatbotService.sendFeedback(sender_psid);
            } else {
                let exec = dataService.getExercise();
                if (exec == null) {
                    await chatbotService.sendMessage("Greate! No more exercise for today. Workout Done ");
                    await chatbotService.sendFeedback(sender_psid);
                } else {
                    await chatbotService.sendReadyNextExercise(sender_psid, exec);
                }
            }
            break;
        case "EXCERCISE":
            if (received_postback.title == "YES") {
                let exec = dataService.getDataById(payload[1]);
                await chatbotService.sendMessage(sender_psid, exec.videoUrl);
                await chatbotService.sendReady(sender_psid, payload[1]);
            } else {
                await chatbotService.sendReady(sender_psid, payload[1]);
            }
            break;
        case "READYNEXTEX":
            if (received_postback.title == "YES") {
                let exec = dataService.getDataById(payload[1]);
                await chatbotService.sendExcercise(sender_psid, exec);

            } else {
                await chatbotService.sendStopWorkout(sender_psid);
            }
            break;
        case "STARTWORKOUT":
            if (received_postback.title == "Start workout") {
                await chatbotService.sendDone(sender_psid);
            } else {
                await chatbotService.sendSkipExec(sender_psid, payload[1]);
            }
            break;
        case "DONE":
            if (received_postback.title == "I’ve finished") {
                let exec = dataService.getExercise();
                if (exec == null) {
                    await chatbotService.sendMessage("Greate! No more exercise for today. Workout Done ");
                    await chatbotService.sendFeedback(sender_psid);
                } else {
                    await chatbotService.sendReadyNextExercise(sender_psid, exec);
                }
            } else {
                await chatbotService.sendSkipExec(sender_psid);
            }
            break;
        case "SKIPEXEC":
            if (received_postback.title == "YES") {
                let exec = dataService.getExercise();
                if (exec == null) {
                    await chatbotService.sendMessage("Greate! No more exercise for today. Workout Done ");
                    await chatbotService.sendFeedback(sender_psid);
                } else {
                    await chatbotService.sendReadyNextExercise(sender_psid, exec);
                }
            } else {
                let exec = dataService.getDataById(payload[1]);
                if (exec == null) {
                    await chatbotService.sendMessage("Greate! No more exercise for today. Workout Done ");
                    await chatbotService.sendFeedback(sender_psid);
                } else {
                    await chatbotService.sendReadyNextExercise(sender_psid, exec);
                }
            }
            break;
    }

    switch (payload) {
        case "GREETING":
            if (received_postback.title == "YES") {
                let exercies = getExercies();
                console.log("exercies " + JSON.stringify(exercies));
            }
            break;
    }

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function initData() {
    exercieses = data;
}

function getExercies() {
    if (exercieses.length != 0) {
        let exercies = exercieses[0];
        exercieses.shift();
        return exercies;
    }

    return null;
}


export { postWebhook, getWebhook }