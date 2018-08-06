var Client = require('instagram-private-api').V1;
var device = new Client.Device('testDevice');
// var __dirname = "~"
var storage = new Client.CookieFileStorage(__dirname + '/../utils/cookies/session.json');

function createSession(username, password){
    Client.Session.create(device, storage, username, password)
    .then((session) => {
        console.log(session);
        // console.log(session);

    })
}

module.exports = {
    createSession
}