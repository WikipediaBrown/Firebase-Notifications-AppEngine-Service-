Firebase Notifications AppEngine Service

Firebase Notifications AppEngine Service is a Google AppEngine service that uses Firebase and Firebase-Queue to send notificaitons to users. Because this service is configured to run on Google's AppEngine platform, the service is able to scale well under heavy usage while maintaining a light footprint during light usage. That causes problems when using Firebase on the server. To overcome problems of multiple notifications being sent under heavy load, I used Firebase-Queue to mediate the problems associated with running multiple instances of this server. Additionally, I included error handling to stop users from spamming eachother with multiple requests. A user will only recieve a notification if they have not deleted the last one.'

Why?

I wanted to send notifications and I found a way to make it easy and reproducable. 

Support

For questions, email info@iamgoodbad.com

License 

MIT LICENSE Copyright © 2017 info@iamgoodbad.com
