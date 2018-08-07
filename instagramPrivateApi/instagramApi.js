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
        // console.log(account)
    let feed = new Client.Feed.AccountFollowers(session, account.id, parseInt(account.followerCount))
    feed.all().then((accounts)=>{
        let followers = [];
        let followersUserNames = [];
        for(let item of accounts){
            followersUserNames.push(item._params.username);
        }
        for(let item of followersUserNames){
        Client.Account.searchForUser(session, item).then((result) =>{
            for (let item of result._params){
                followers.push(item);
            }
        })

    }
        // console.log(followers)
        // _.map(followersNew, followers => _.pick(followers, 'id','_params.username', '_params.fullName', '_params.profilePicUrl'))
        // console.log(followersNew.length)
        // console.log(followers);
        // writeIntoFile(followers);
        })
    })
    // .catch(()=>{
    //     console.log("\x1b[31m", "Connection Error, please try again later.")
    // });
}

function writeIntoFile(followers){
    fs.writeFile(__dirname + "/../utils/followers.csv", followers, { flag: 'w' }, function (err) {
        if (err) throw err;
        console.log("It's saved!");
    });
}
module.exports = {
    createSession
}
//node --max-old-space-size=4096 yourFile.js
