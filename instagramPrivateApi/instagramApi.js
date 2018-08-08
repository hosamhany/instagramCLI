var Client = require('instagram-private-api').V1;
var device = new Client.Device('testDevice');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
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
        followersIds = [];
        for(let item of accounts){
            followersIds.push(item.id);
        }

        // console.log(followersIds);
        while(followersIds.length !=0){
            var dataToWrite;
            async.mapLimit(followersIds, 2, (followerId, callback) => {
                Client.Account.getById(session, followerId).then((res) =>{
                    console.log(res._params);
                    // followers = _.map(res._params, _.partialRight(_.pick, ['pk', 'username', 'fullName','isPrivate','profilePicUrl', 'mediaCount', 'biography', 'followerCount', 'followingCount', 'externalUrl']));
                    // dataToWrite= res._params;
                    // console.log(followers)
                    setTimeout(1500);

                    
                })
            });
          followersIds.shift();
          followersIds.shift();
          
            
        }
        })
    })
    .catch((err)=>{
        console.log("\x1b[31m", "Connection Error: ", err.message);
    });
}

function writeIntoFile(followers){
    fs.writeFile(__dirname + "/../result.csv", followers, { flag: 'w' }, function (err) {
        if (err) throw err;
        console.log("It's saved!");
    });
    setTimeout(500);
}
module.exports = {
    createSession
}
//node --max-old-space-size=4096 yourFile.js
//TODO: try the getCursor approach along with 