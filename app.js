// This service is somewhat obsolete. The current version of Firebase-Admin accomodates sending notifications through
// the library. That said, there are reasons that users would not want to upgrade and for them, there's this.
// [START notificationsservice app]
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var rp = require('request-promise');
var admin = require('firebase-admin');
var Queue = require('firebase-queue');

// Setup Express
var app = express();

// Setup Firebase-Admin
admin.initializeApp({
    credential: admin.credential.cert("<PATH/TO/YOUR/SERVICEACCOUNT.JSON>"),
    databaseURL: "<YOUR DATABASE URL>"
});

// Setup Firebase Database
var db = admin.database();
var incomingNotifications = db.ref('/incomingNotifications');
var userNotifications = db.ref('/userNotifications');

// Firebase notificaitons API key
var API_KEY = "<YOUR FIREBASE API KEY HERE>";

// Body parser for JSON and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup Firebase-Queue
var queue = new Queue(incomingNotifications, function(data, progress, resolve, reject) {

    // Extract data from queue object
    var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')+" +0000";
    var nofifierName = incomingNotification.nofifierName;
    var notifieeName = incomingNotification.notifieeName;
    var notifierID = incomingNotification.notifierID;
    var notifieeID = incomingNotification.notifieeID;
    var incomingNotification = data;
    var alreadyNotified = false;
    var notificationCount = 0;
    

    // Get current list of notifcations for user and identify which ones they have seen by the key "Viewed"
    userNotifications.child(notifieeID).once("value").then(function(snapshot) {

        progress(25);
        return snapshot.forEach(function(thisNotification) {
            var notification = thisNotification.val()
            if (notification.viewed == false) {
                notificationCount++ 
            };
            if (thisNotification.key == userID+followerID) {
                alreadyNotified = true
            };
        });
    // If user was already notified with this notification, the promise is rejected and no notification is sent, else, the promise returns
    }).then(function(snapshot) {

        progress(50);
        if (alreadyNotified == false) {
            return Promise.resolve()
        } else {
            return Promise.reject()
        }
    // Send notification
    }).then(function() {

        progress(75);
        // Compose & send notification
        rp({
            url: 'https://fcm.googleapis.com/fcm/send',
            method: 'POST',
            headers: {
                'Content-Type' :'application/json',
                'Authorization': 'key='+API_KEY
            },
            body: JSON.stringify({
                "to" : "/topics/"+"<INSERT USER TOPIC PREFIX HERE>-" + notifieeID,
                "priority": "high",
                "notification" : {
                    "body" : notifieeName+" ("+nofifierName+")"+" has notified you",
                    "badge": String(notificationCount+1)
                },
                "data" : {
                    "someData" : "Extra stuff."
                }
            })
        // If request is successful, put notification on users notifications node for UI and record keeping.
        }).then(function(body) {
            progress(100);
            userNotifications.child(notifieeID).child(notifieeID+notifierID).update({
                "date": now,
                "type": "generic",
                "notifier": notifierID,
                "viewed": false
            })
            resolve();
        // If request fails, set progress to 99, reject the queue object & log the error
        }).catch(function(error) {
            progress(99);
            console.log(error);
            reject(); 
        });
    // User was already notified. This stops users from being able to spam people with multiple notifications (like if somebody presses "like" and then "unlike" over and over)
    }).catch(function() {
        progress(100);
        console.log("Already notified.");
        resolve();
    });

    // Timesout worker if taking too long.
    setTimeout(function() {
        resolve();
    }, 1000);
});

// Start the server
var server = app.listen(process.env.PORT || '8080', function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});
// [END app]
