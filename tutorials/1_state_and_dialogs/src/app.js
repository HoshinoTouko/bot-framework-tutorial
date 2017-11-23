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

        if (!session.userData.userName){
            session.beginDialog('askName');
            return;
        }

        if(!session.userData.sex){
            session.beginDialog('chooseSex');
            return;
        }

        if (userMessage === 'Hello'){
            session.send("Hello world.");
        }
        else{
            console.log("No answer.");
            session.send("I do not understand.");
        }
    }
]);

bot.dialog('askName', [
    function (session) {
        builder.Prompts.text(session, '我想认识你，请问你叫什么名字？');
    },
    function (session, results) {
        session.userData.userName = results.response;
        session.endDialog(`你好呀，${session.userData.userName}!`);
    }
]);

bot.dialog("chooseSex", [
    function(session) {
        builder.Prompts.choice(session, '请问你的性别是？', '男|女|秀吉', { listStyle: builder.ListStyle.button });
    },
    function(session, results, next) {
        let greetWords = {
            'Male': '是男孩子呢！',
            'Female': '是女孩子呢！',
            'Xiuji': '哇！是秀吉！'
        };
        switch (results.response.index){
            case 0:
                session.userData.sex = 'Male';
                break;
            case 1:
                session.userData.sex = 'Female';
                break;
            case 2:
            default:
                session.userData.sex = 'Xiuji';
                break;
        }
        session.send(greetWords[session.userData.sex]);
        next();
    },
    function(session, results, next) {
        session.endDialog();
    }
]);
