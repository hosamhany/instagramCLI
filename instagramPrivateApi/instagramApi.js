var Client = require('instagram-private-api').V1;
var device = new Client.Device('testDevice');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var sleep = require('system-sleep')
var async = require('async');
// var __dirname = "~"
var storage = new Client.CookieFileStorage(__dirname + '/../utils/cookies/session.json');

function createSession(username, password, accountName) {
    Client.Session.create(device, storage, username, password)
        .then((session) => {
            return [session, Client.Account.searchForUser(session, accountName)]
        })
        .spread(function (session, account) {
            let feed = new Client.Feed.AccountFollowers(session, account.id, parseInt(account.followerCount))
            feed.all().then((accounts) => {
                let followers = [];
                let followers2 = [];
                followersIds = [];
                for (let item of accounts) {
                    followersIds.push(item.id);
                }
                var followersDivided= chunkify(followersIds, 1400, false);
                console.error(followersDivided.length);
                var first = followersDivided[0]
                console.error(first.length);

            
        //still not working too many API hits
                // x.forEach((arr)=>{
                //     arr.forEach((data)=>{
                //         Client.Account.getById(session, data).then((details) => {
                //             followers = _.map(details._params, _.partialRight(_.pick, ['pk', 'username', 'fullName','isPrivate','profilePicUrl', 'mediaCount', 'biography', 'followerCount', 'followingCount', 'externalUrl']));
                //             // followers.push(details._params)
                //             console.log(followers[followers.length-1])
                //             console.log(followers.length)
                //         })
                //     })
                // })





                // followersIds.forEach(followerID => {
                //     Client.Account.getById(session, followerID).then((details) => {
                //         followers.push(details);
                //         console.log(followers.length)
                //     })
                //         .catch((err) => {
                //             Promise.resolve().delay(3000);
                //             console.log(err);
                //         })
                // })

            })
        })
        .catch((err) => {
            console.log("\x1b[31m", "Connection Error: ", err.message);
        });
}

function chunkify(a, n, balanced) {
    if (n < 2)
        return [a];
    var len = a.length,
        out = [],
        i = 0,
        size;
    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }
    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }
    else {
        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));
    }
    return out;
}

function writeIntoFile(followers) {
    fs.writeFile(__dirname + "/../result.csv", followers, { flag: 'w' }, function (err) {
        if (err) throw err;
        console.log("It's saved!");
    });
    setTimeout(500);
}
module.exports = {
    createSession,
    chunkify
}
//node --max-old-space-size=4096 yourFile.js
//TODO: try the getCursor approach along with 


        // for (var i = 0; i< followersIds.length; i++){
        //         Client.Account.getById(session, followersIds[i]).then((res) =>{
        //             console.log(res._params);
        //             followers.push(res._params);
        //             console.log(followers.length);
        //         }, (res) => {
        //             followers2.push(res)
        //         })
        // }
        // console.log(followersIds);
        // while(followersIds.length !=0){
        //     var dataToWrite;
        //     async.mapLimit(followersIds, 100, function (followerId) {
        //         setTimeout(Client.Account.getById(session, followerId).then((res) =>{
        //             console.log(res._params);
        //             followers.push(res._params);
        //             console.log(followers.length);
        //             followersIds.shift();


        //         }), 1000);
        //     });          

        // }