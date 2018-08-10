var Client = require('instagram-private-api').V1;
var device = new Client.Device('testDevice');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');

// var __dirname = "~"
var storage = new Client.CookieFileStorage(__dirname + '/../utils/cookies/session.json');

function createSession(username, password, accountName){
    Client.Session.create(device, storage, username, password)
    .then((session) => {
        return [session, Client.Account.searchForUser(session, accountName)]
    })
    .spread(function(session, account) {
    let feed = new Client.Feed.AccountFollowers(session, account.id, parseInt(account.followerCount))
    feed.all().then((accounts)=>{
        let followers = [];
        let followersUserNames = [];
        for(let item of accounts){
            followersUserNames.push(item._params);
        }
        followers = _.map(followersUserNames, _.partialRight(_.pick, ['pk', 'username', 'fullName','isPrivate','profilePicUrl']));
        // console.log(followers)
        writeIntoFile(followers)

        })
    })
    .catch((err)=>{
        console.log("\x1b[31m", "Connection Error: ", err.message);
    });
}

function writeIntoFile(followers){
    fs.writeFile(__dirname + "/../result.csv", JSON.stringify(followers), { flag: 'w' }, function (err) {
        if (err) throw err;
        console.log("Followers' data is saved in result.csv file");
    });
}
module.exports = {
    createSession
}
//node --max-old-space-size=4096 yourFile.js
//TODO: try the getCursor approach along with 