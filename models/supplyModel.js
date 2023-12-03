const mongoose = require('mongoose');
const moment = require('moment');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A blog must have a name'],
            trim: true,
        },
        slug: String,
        description: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        school: {
            type: mongoose.Schema.ObjectId,
            ref: 'School',
            required: true,
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A blog must have a summary'],
        },
        image: String,
        home: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    },
);

blogSchema.index({ title: 1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ tags: 1 });

blogSchema.pre('save', function (next) {
    const date = new Date();
    this.slug = `${slugify(this.title, { lower: true })}-${moment(date).format(
        'DDHHmmss',
    )}`;
    next();
});
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
