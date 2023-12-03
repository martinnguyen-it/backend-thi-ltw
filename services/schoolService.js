const commonService = require('./commonService');
const School = require('../models/schoolModel');

module.exports = class schoolService extends commonService {
    static async getSchoolById(id) {
        return School.findById(id);
    }
};
