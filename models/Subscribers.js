const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    email: String
});

const Subscribers = mongoose.model('Subscriber', SubscriberSchema);

module.exports = Subscribers;