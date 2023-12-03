const blogService = require('../services/blogService');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');
const schoolService = require('../services/schoolService');
const AppError = require('../helpers/appError');

exports.getAllBlog = catchAsync(async (req, res, next) => {
    const blogs = await blogService.getAllBlog();

    res.status(200).json({ status: 'success', data: blogs });
});

exports.createBlog = catchAsync(async (req, res, next) => {
    const data = req.body;
    data.author = req.user.id;
    if (req.body.school) {
        const checkSchool = schoolService.getSchoolById(req.body.school);
        if (checkSchool) {
            const blog = await blogService.createBlog(data);
            res.status(200).json({ status: 'success', data: blog });
        }
        return next(new AppError('No school found with that ID.', 404));
    }
});

exports.updateBlog = blogService.updateOne(Blog);

exports.getBlog = catchAsync(async (req, res, next) => {
    let query = Blog.findById(req.params.id).populate();

    query = query
        .populate({
            path: 'school',
        })
        .populate({
            path: 'author',
            select: 'email name photo',
        });

    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID.', 404));
    }

    res.status(200).json({ status: 'success', data: doc });
});

exports.deleteBlog = blogService.deleteOne(Blog);
