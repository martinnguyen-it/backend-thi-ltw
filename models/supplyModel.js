const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A supply must have a name'],
            trim: true,
        },
        point: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['not_received', 'received', 'transfer'],
                message: 'status is either : not_received, received, transfer.',
            },
        },
        image: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    },
);

supplySchema.index({ name: 1 });

const Supply = mongoose.model('Supply', supplySchema);

module.exports = Supply;
