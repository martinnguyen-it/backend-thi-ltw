const schoolService = require('../services/schoolService');
const School = require('../models/schoolModel');

exports.getAllSchool = schoolService.getAll(School, {
    path: 'blog',
});

exports.getSchool = schoolService.getOne(School, {
    path: 'blog',
});

exports.createSchool = schoolService.createOne(School);

exports.updateSchool = schoolService.updateOne(School);

exports.deleteSchool = schoolService.deleteOne(School);
