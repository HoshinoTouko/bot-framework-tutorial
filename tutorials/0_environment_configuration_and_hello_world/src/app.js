'use strict';
// This loads bot-framework requires
const builder = require('botbuilder');
const restify = require('restify');

// Setup restify server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create connector and listen for messages
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

// Create a bot by connector
const bot = new builder.UniversalBot(connector, {});

// Root dialog
bot.dialog('/', [
    function(session){
        let userMessage = session.message.text;

        if (userMessage === 'Hello'){
            session.send("Hello world.");
        }
        else{
            console.log("No answer.");
            session.send("I do not understand.");
        }
    }
]);
