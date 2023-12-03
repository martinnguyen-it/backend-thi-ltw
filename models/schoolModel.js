const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    },
);

schoolSchema.virtual('blog', {
    ref: 'Blog',
    foreignField: 'school',
    localField: '_id',
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;
