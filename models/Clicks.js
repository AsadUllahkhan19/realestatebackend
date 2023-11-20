const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    propertyId: mongoose.Schema.Types.ObjectId,
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    date: { type: Date }
})

const Clicks = mongoose.model('Click', ClickSchema);

module.exports = Clicks;