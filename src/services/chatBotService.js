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
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Hello, are you ready to start/continue the workout?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "YES",
                                "payload": "GREETING"
                            },
                            {
                                "type": "postback",
                                "title": "NO",
                                "payload": "GREETING",
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendExcercise = (sender_psid, excercise) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": `The next excercies is: ${excercise.name}, reps: ${excercise.reps}, sets: ${excercise.sets}`,
                            "subtitle": "Do you want an instruction video for this exercise?",
                            "image_url": excercise.imageUrl,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "YES",
                                    "payload": "EXCERCISE:" + excercise.id,
                                },
                                {
                                    "type": "postback",
                                    "title": "NO",
                                    "payload": "EXCERCISE",
                                }
                            ],
                        }]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendReady = (sender_psid, execId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `What do you want to do now?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Start workout",
                                "payload": "STARTWORKOUT" 
                            },
                            {
                                "type": "postback",
                                "title": "Skip workout",
                                "payload": "STARTWORKOUT:" + execId,
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendDone = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Tell me when you're done!`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "I’ve finished",
                                "payload": "DONE"
                            },
                            {
                                "type": "postback",
                                "title": "I have to stop",
                                "payload": "DONE",
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendSkipExec = (sender_psid, execId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Do you really want to skip the exercise`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "YES",
                                "payload": "SKIPEXEC"
                            },
                            {
                                "type": "postback",
                                "title": "NO",
                                "payload": "SKIPEXEC:" + execId,
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendReadyNextExercise = (sender_psid, excercise) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Are you ready for the next exercise: ${excercise.name} `,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "YES",
                                "payload": "READYNEXTEX:" + excercise.id
                            },
                            {
                                "type": "postback",
                                "title": "NO",
                                "payload": "READYNEXTEX",
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendFeedback = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `How did you feel during the workout?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "👍",
                                "payload": "FEEDBACK"
                            },
                            {
                                "type": "postback",
                                "title": "OK",
                                "payload": "FEEDBACK",
                            },
                            {
                                "type": "postback",
                                "title": "👎",
                                "payload": "FEEDBACK",
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

let sendStopWorkout = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": `Do you really want to stop the workout?`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "YES",
                                "payload": "STOPWORKOUT"
                            },
                            {
                                "type": "postback",
                                "title": "NO",
                                "payload": "STOPWORKOUT",
                            }
                        ]
                    }
                }
            };

            await sendMessage(sender_psid, response);
            resolve("done!");
        } catch (e) {
            reject(e);
        }
    })
};

export {
    sendMessage,
    sendGreeting,
    sendExcercise,
    sendReady,
    sendDone,
    sendSkipExec,
    sendReadyNextExercise,
    sendFeedback,
    sendStopWorkout
}