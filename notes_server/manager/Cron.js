const cron = require('node-cron');
const Database = require('./../db/Db');

const admin = require("firebase-admin");
const serviceAccount = require("./../config/firebase-key.json");

const TelegramBot = require('node-telegram-bot-api');
const token = require('./../config/telegram.json').token;
const bot = new TelegramBot(token, {polling: true});

class CronManager {
    constructor() {
        this.db = Database;

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://test-a5526.firebaseio.com"
        });

        cron.schedule('* * * * * *', ()=> {
            this.sendNotification();
        });
    }

    async sendNotification() {
        const allNotes = await this.db.notes.get({});

        for (let i = 0; i < allNotes.length; i++) {
            if (Math.floor(allNotes[i].time/1000) === Math.floor((new Date())/1000)) {
                this.sendByFirebase(allNotes[i]);
                this.sendByTelegram(allNotes[i]);
            }
        }
    }

    async sendByFirebase(params) {
        const payload = {
            notification: {
                title: params.header,
                body: params.message
            }
        };

        admin.messaging().sendToDevice(params.user_id, payload)
            .then(function(response) {
                console.log("Successfully sent message:", response);
            })
            .catch(function(error) {
                console.log("Error sending message:", error);
            });
    }

    async sendByTelegram(params) {
        const settings = await this.db.settings.get({user_id: params.user_id});

        if (!settings || !settings.telegram || !settings.telegram_url)
            return;

        bot.sendMessage(settings.telegram_url, `Нотификация: ${params.header} (${params.message})`);
    }
}

module.export = new CronManager();