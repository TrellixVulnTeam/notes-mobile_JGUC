const Settings = require('./table');

class SettingsQuery {
    static get(params = {}) {
        return new Promise((res, rej) => {
            Settings.find(params, {_v: false}, {sort: {time: -1}}, (err, data) => {
                if (err)
                    return rej(err);

                res(data[0])
            })
        });
    }

    static add(params) {
        return new Promise((res, rej) => {
            const newItem = new Settings(params);

            newItem.save(function (err) {
                return (!err)? res(newItem._id) : rej(err);
            });
        });
    }

    static update(params, conditions) {
        return new Promise((res, rej) => {
            Settings.update(conditions, params, function (err) {
                return (!err)? res(true) : rej(err);
            });
        });
    }

    static delete(params) {
        return new Promise((res, rej) => {
            Settings.remove(params, (err, success) => {
                return (!err)? res(success) : rej(err);
            })
        })
    }
}

module.exports = SettingsQuery;