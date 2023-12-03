const commonService = require('./commonService');
const Blog = require('../models/blogModel');
const APIFeatures = require('../utils/apiFeatures');

module.exports = class blogService extends commonService {
    static async createBlog(data) {
        return Blog.create(data);
    }

    static async getAllBlog() {
        const queryMongoDB = Blog.find()
            .populate({
                path: 'school',
            })
            .populate({
                path: 'author',
                select: 'email name photo',
            });

        const features = new APIFeatures(queryMongoDB)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const docs = await features.query;

        return docs;
    }
};
