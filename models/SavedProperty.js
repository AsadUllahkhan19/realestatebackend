const mongoose = require('mongoose');

const SavedSchema = new mongoose.Schema({
    userId: mongoose.ObjectId,
    propertyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Property'
    }
})

const SavedProperty = mongoose.model('SavedProperty', SavedSchema);

module.exports = SavedProperty;