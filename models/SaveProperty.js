const mongoose = require('mongoose');

const SavePropertySchema = new mongoose.Schema({
    userId: String,
    propertyId: String,
})

const SavedProperties = mongoose.model('SavedProperty', SavePropertySchema)

module.exports = SavedProperties;

