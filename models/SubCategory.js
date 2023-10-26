const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    key: String,
    value: String,
    type: String
})

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;