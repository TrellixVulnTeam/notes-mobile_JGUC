'use strict';

var express     = require("express");
var app         = express();
var body        = require('body-parser');
var path        = require('path');

//CONNECT DATABASE AND CRON
const Database = require('./db/Db');
const dbConfig = require('./config/database.json');
Database.connect(dbConfig.url);

const Cron = require('./manager/Cron');
//****************

app.use(body.urlencoded({ extended: false }));
app.use(body.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/notes/get', async (req, res) => {
    res.json(await Database.notes.get({user_id: req.body.registration_id}));
});

app.post('/notes/add', async (req, res) => {
    await Database.notes.add({
        user_id: req.body.registration_id,
        time: new Date(req.body.time),
        header: req.body.header,
        message: req.body.message
    });

    res.json(await Database.notes.get({user_id: req.body.registration_id}));
});

app.post('/notes/update', async (req, res) => {
    const notes = await Database.notes.get({user_id: req.body.registration_id});
    let index;

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === req.body.id) {
          index = i;
        }
    }

    notes[index].time = new Date(req.body.time);
    notes[index].header = req.body.header;
    notes[index].message = req.body.message;

    await Database.notes.update(notes, {_id: notes[index].id});
    res.json(await Database.notes.get({user_id: req.body.registration_id}));
});

app.post('/notes/delete', async (req, res) => {
    await Database.notes.delete({_id: req.body.id});
    res.json(true);
});

app.post('/settings/get', async (req, res) => {
    const settings = await Database.settings.get({user_id: req.body.registration_id});
    res.json(settings || {});
});

app.post('/settings/update', async (req, res) => {
    const settings = await Database.settings.get({user_id: req.body.registration_id});

    if (!settings)
        await Database.settings.add(Object.assign({user_id: req.body.registration_id}, req.body.params));
    else
        await Database.settings.update(req.body.params, {user_id: req.body.registration_id});

    res.json(true);
});

app.listen(8080, function () {
  console.log('Server created!');
});