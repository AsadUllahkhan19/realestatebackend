const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    ownerId: mongoose.Types.ObjectId,
    // typesAndPurposes
    typesAndPurpose: {
        category: String,
        subCategory: String,
        furnished: Boolean,
        purpose: String,
        featured: { type: String, default: false }
    },
    // locationAndAddress
    locationAndAddress: {
        location: String,
        longitude: String,
        latitude: String,
        address: String,
    },
    // propertyDetails
    propertyDetails: {
        refNo: String,
        title: String,
        titleArabic: String,
        description: String,
        descriptionArabic: String,
        areaSquare: Number,
        InclusivePrice: Number,
        PermitNumber: Number,
        occupancyStatus: String,
        completionStatus: String,
        ownerShipStatus: String,
        // bedRooms: Number,
        // bathRooms: Number,
        financingAvailable: String,
        financingInstittionsName: String,
    },
    // rentalDetails
    rentalDetails: {
        rent: Number,
        rentFrequency: String,
        minimumContractPeriod: Number,
        noticePeriod: Number,
        maintainanceFee: Number,
        paidBy: String,
    },
    // Contact Details
    contactDetails: {
        ListingOwner: String,
        contactPerson: String,
        email: String,
        phone: String,
    },

    // Amenities
    amenities: [{ name: String, value: String }],
    // Upload
    upload: {
        images: [String],
        videos: [String],
    },
    // Add Impressions
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    leads: { type: Number, default:0 },
    // tracking document
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now() }
})

const Property = mongoose.model('Property', PropertySchema)

module.exports = Property;

