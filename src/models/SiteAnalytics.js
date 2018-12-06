const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnalyticSchema = new mongoose.Schema({
    currentUsers: {
        type: Number,
        default: 0,
    },
    totalUsers: {
        type: Number,
        default: 0,
    },
    totalTime: {
        type: Number,
        default: 0,
    },
    usernames: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('SiteAnalytics', AnalyticSchema);
