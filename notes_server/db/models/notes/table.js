const mongoose = require('mongoose');

const notes = mongoose.Schema;

const Notes = new notes({
    user_id: { type: String, required: true },
    time: { type: Date, required: true },
    header: { type: String, required: true },
    message: { type: String, required: true }
});

const NotesModel = mongoose.model('Notes', Notes);

module.exports = NotesModel;