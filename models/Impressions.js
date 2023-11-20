const mongoose = require('mongoose');

const ImpressionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    propertyId: mongoose.Schema.Types.ObjectId,
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    date: { type: Date }
})

const Impressions = mongoose.model('Impression', ImpressionSchema);

module.exports = Impressions;