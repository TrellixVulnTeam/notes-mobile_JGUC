const mongoose = require('mongoose');
const notes = require('./models/notes/query');
const settings = require('./models/settings/query');

class Db {
    static connect(url) {
        mongoose.connect(url);
    }

    static get notes() {
        return notes;
    }

    static get settings() {
        return settings;
    }
}

module.exports = Db;