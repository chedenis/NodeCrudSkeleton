"use strict";
var mongoose = require("mongoose");
var uuid = require("uuid");
var logger = require("winston");
var util = require("util");
var config = require("freds-config");

var offsetSchema = new mongoose.Schema({
    entityKey: { type: String, required: true },
    createdTimeStamp: { type: Date, required: true },
    updatedTimeStamp: { type: Date, required: true }
});


var offsetSchema = new mongoose.Schema({
     entityKey: {
         required: true,
         type: String
     },
    requestDate: {
        required: true,
        type: Date
    },
    approvalDate: {
        type: Date
    },
    approvalStatus: {
        type: String,
        enum: ["Pending", "Approved", "Canceled", "Invalid", "Premium Received"]
    },
    member: {
        groupId: { type: String, required: true },
        participantId: { type: String, required: true },
        accountNumber: { type: Number, required: true }
    },
    createdTimestamp: {
        required: true,
        type: Date
    },
    createdBy: {
        required: true,
        type: String
    },
    updatedBy: {
        required: true,
        type: String
    },
    updatedTimestamp: {
        required: true,
        type: Date
    }
});

offsetSchema.pre('validate', function (next) {
    if (!this.entityKey) {
        this.entityKey = uuid.v4();
        this.createdTimestamp = new Date();
        this.createdBy = this.updatedBy;
    }
    next();
});

offsetSchema.statics.read = function read(entityKey, cb) {
    var query = { facilityEntityKey: entityKey };
    this.find(query)
        .sort({ createdTimeStamp: -1 })
        .limit(1)
        .lean() // This returns a plain ole JS object and allows us to add some meta data
        .exec(function (err, results) {
            if (err) return cb(err);
            var interaction = results[0];
            cb(null, interaction);
        });
};

var mongoUri = config.get("mongo.uri");
var options = config.get("mongo.options");
var db = mongoose.createConnection(mongoUri, options);

db.on('connecting', function () {
    logger.info('Offset Tracker (Offsets):document:connecting...');
});

db.on('error', function (error) {
    logger.error('Offset Tracker (Offsets):document:Error in MongoDb connection: ' + error);
    db.disconnect();
});

db.on('connected', function () {
    logger.info('Offset Tracker (Offsets):document:connected!');
});

db.once('open', function () {
    logger.info('Offset Tracker (Offsets):document:connection open');
});

db.on('reconnected', function () {
    logger.info('Offset Tracker (Offsets):document:reconnected');
});

db.on('disconnected', function () {
    logger.info('Offset Tracker (Offsets):document:disconnected');
    logger.info('mongoUri is: ' + mongoUri);
    db = mongoose.createConnection(mongoUri, options);
});


var OffsetTracker = db.model('Offsets', offsetSchema);

module.exports = OffsetTracker;
