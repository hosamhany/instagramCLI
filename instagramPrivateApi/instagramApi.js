var Client = require('instagram-private-api').V1;
var device = new Client.Device('testDevice');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');
var sleep = require('system-sleep')
var async = require('async');
var storage = new Client.CookieFileStorage(__dirname + '/../utils/cookies/session.json');

function createSession(username, password) {
    Client.Session.create(device, storage, username, password)
        .then((session) => {
            return [session, Client.Account.searchForUser(session, "saschafirtina")]
        })
        .spread(function (session, account) {
            let feed = new Client.Feed.AccountFollowers(session, account.id, parseInt(account.followerCount))
            feed.all().then((accounts) => {
                let followers = [];
                followersIds = [];
                //pushing the followrs' Ids into an array
                for (let item of accounts) {
                    followersIds.push(item.id);
                }
                //breaking down the array of Ids into several arrays to send batch requests
                var followersDivided = chunkify(followersIds, 1400, false);
                /// console.error(followersDivided.length);
                //looping on every batch to be sent to get the details of every account ID
                while ((first = followersDivided.pop()) != null) {
                    console.error(first.length);
                    first.forEach(id => {
                        Client.Account.getById(session, id).then((details) => {
                            user = details._params;
                            followers.push(createUserDetails(user.profilePicUrl, user.id, user.username, user.fullName, user.biography, user.followerCount, user.followingCount, user.isPrivate, user.mediaCount, user.externalUrl));
                            writeIntoFile(followers)
                            ///console.log("Batch done")
                        })
                    })
                    sleep(20000)
                }
            })
        })
        .catch((err) => {
            console.log("\x1b[31m", "Connection Error: ", err.message);
        });
}
//builder method that takes certain data from the results and formulates the requested data only
function createUserDetails(profilePicUrl, pk, username, fullName, biography, followerCount, followingCount, isPrivate, mediaCount, externalUrl) {

    return {
        'profilePicUrl': profilePicUrl,
        'userId': pk,
        'username': username,
        'fullName': fullName,
        'biography': biography,
        'followerCount': followerCount,
        'followingCount': followingCount,
        'isPrivate': isPrivate,
        'mediaCount': mediaCount,
        'externalUrl': externalUrl
    }
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
    followers.forEach((follower) => {
        fs.writeFile(__dirname + "/../result.csv", JSON.stringify(followers), { flag: 'w' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    })

}
module.exports = {
    createSession,
    chunkify
}
//node --max-old-space-size=4096 cliTool.js
//TODO: try the getCursor approach along with 
        //getCursor() did not really work.
        //proxy apporach, needs resources
        //edited in the feeds.json to catch the RequestLimitError and retry once again, did not work
