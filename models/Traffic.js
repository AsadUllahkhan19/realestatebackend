const mongoose = require('mongoose');

const TrafficSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    propertyId: mongoose.Schema.Types.ObjectId,
    lead: Number
})

const Traffic = mongoose.model('Traffic', TrafficSchema);

module.exports = Traffic;