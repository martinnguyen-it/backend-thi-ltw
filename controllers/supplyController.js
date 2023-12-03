const supplyService = require('../services/supplyService');
const Supply = require('../models/supplyModel');

exports.getAllSupply = supplyService.getAll(Supply);

exports.getSupply = supplyService.getOne(Supply);

exports.createSupply = supplyService.createOne(Supply);

exports.updateSupply = supplyService.updateOne(Supply);

exports.deleteSupply = supplyService.deleteOne(Supply);
