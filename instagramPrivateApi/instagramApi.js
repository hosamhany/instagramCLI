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
                followersIds = [];
                for (let item of accounts) {
                    followersIds.push(item.id);
                }
                var followersDivided= chunkify(followersIds, 100, false);
                console.error(followersDivided.length);
                while((first = followersDivided.pop()) !=null){
                console.error(first.length);
                first.forEach(id => {
                    Client.Account.getById(session, id).then((details) => {
                        user = details._params;
                        followers.push(createUserDetails(user.profilePicUrl,user.pk, user.username, user.fullName, user.biography, user.followerCount, user.followingCount, user.isPrivate, user.mediaCount, user.externalUrl));
                        // console.log(followers);
                        writeIntoFile(followers)
                    })
                })
            sleep(20000)
            }
            
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
            })
        })
        .catch((err) => {
            console.log("\x1b[31m", "Connection Error: ", err.message);
        });
}
function createUserDetails(profilePicUrl, pk, username, fullName, biography, followerCount, followingCount, isPrivate, mediaCount, externalUrl){
    
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
    followers.forEach((follower)=> {
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