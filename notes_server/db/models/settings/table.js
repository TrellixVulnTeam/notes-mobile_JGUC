const mongoose = require('mongoose');

const settings = mongoose.Schema;

const Settings = new settings({
    user_id: { type: String, required: true },
    telegram: { type: Boolean },
    telegram_url: { type: String },
    repeat: { type: String },
    repeat_number: { type: String },
    clear_time: { type: String }
});

const SettingsModel = mongoose.model('Settings', Settings);

module.exports = SettingsModel;