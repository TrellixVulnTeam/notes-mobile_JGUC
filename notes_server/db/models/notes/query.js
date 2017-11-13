const Notes = require('./table');

class NotesQuery {
    static get(params = {}) {
        return new Promise((res, rej) => {
            Notes.find(params, {_v: false}, {sort: {time: -1}}, (err, data) => {
                if (err)
                    return rej(err);

                for (let i = 0; i < data.length; i++) {
                    data[i]._doc.id = data[i]._id;

                    if (data[i].time < new Date())
                        data[i]._doc.deprecated = true;
                };

                res(data)
            })
        });
    }

    static add(params) {
        return new Promise((res, rej) => {
            const newItem = new Notes(params);

            newItem.save(function (err) {
                return (!err)? res(newItem._id) : rej(err);
            });
        });
    }

    static update(params, conditions) {
        return new Promise((res, rej) => {
            Notes.update(conditions, params, function (err) {
                return (!err)? res(true) : rej(err);
            });
        });
    }

    static delete(params) {
        return new Promise((res, rej) => {
            Notes.remove(params, (err, success) => {
                return (!err)? res(success) : rej(err);
            })
        })
    }
}

module.exports = NotesQuery;