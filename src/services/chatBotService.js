import dotenv from 'dotenv';
dotenv.config();
import request from 'request';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendMessage = (sender_psid, response) => {
    return new Promise((resolve, reject) => {
        try {
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response,
            };

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v6.0/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                console.log(res)
                console.log(body)
                if (!err) {
                    console.log("message sent!");
                    resolve('done!')
                } else {
                    reject("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let sendGreeting = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try{
            
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Hello, are you ready to start the workout?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "YES",
                                "payload": "START"
                            },
                            {
                                "type": "postback",
                                "title": "NO",
                                "payload": "START",
                            }
                        ]
                    }
                }
            };
            
            await sendMessage(sender_psid, response);
            resolve("done!");
        }catch (e) {
            reject(e);
        }
    })
};

export {
    sendGreeting
}