'use strict';

var OffsetController = function (scope) {
    if (typeof scope === 'undefined') { scope = {}; } // eslint-disable-line

    var OffsetModel = scope.OffsetModel; // = require('./../models/resident')().Resident;
    // var ResidentAuthorization = scope.ResidentAuthorization; // = require('./../models/resident-authorization')().ResidentAuthorization;

    var create = function (req, res) {
        return new Promise(function (resolve) {
            console.log("Offset sent: " + JSON.stringify(req.body));
            var newOffset = req.body;
            newOffset.updatedBy = "foo";
            newOffset.updatedTimestamp = new Date();

            console.log(JSON.stringify(newOffset));

            OffsetModel.create(newOffset, function (err, offset) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return resolve(err);
                }
                console.log("Created a offset Yayyy... " + offset);
                res.send(offset);
                return resolve(offset);
            });
        });
    }


    var update = function (req, res) {
        return new Promise(function (resolve) {
            console.log("Offset update sent: " + JSON.stringify(req.body));
            var newOffset = req.body;

            if (req.body.entityKey && req.body.entityKey != "") {
                newOffset.updatedBy = "foo";
                newOffset.updatedTimestamp = new Date();
                OffsetModel.update({ entityKey: newOffset.entityKey }, newOffset, function (err) {
                    if (err) {
                        res.status(500).send(err);
                        return reject(err);
                    } else {
                        res.send(true);
                        return resolve(true);
                    }
                });
            } else {
                res.status(500).send(err);
                return reject(err);
            }
        })
    }

    var read = function (req, res) {
        return new Promise(function (resolve) {
            OffsetModel.read(req.params.entityKey, function (err, offset) {
                if (err) {
                    res.status(500).send(err);
                    return reject(err);
                } else if (!offset) {
                    res.send({});
                    return resolve({});
                } else {
                    res.send(offset);
                    return resolve(offset);
                }
            });
        });
    }

    var list = function (req, res) {
        console.log("Offset list sent: " + JSON.stringify(req.body));
        return new Promise(function (resolve) {
            OffsetModel.find(req.body, function (err, offsets) {
                if (err) {
                    res.status(500).send(err);
                    return reject(err);
                } else if (!offsets) {
                    res.send({});
                    return resolve({});
                } else {
                    res.send(offsets);
                    return resolve(offsets);
                }
            });
        });
    }



    return {
        create: create,
        update: update,
        read: read,
        list: list
    };
};

module.exports = OffsetController;
