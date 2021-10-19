const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { kietService } = require('../services');

const createKiet = catchAsync(async (req, res) => {
  const kiet = await kietService.createKiet(req.body);
  res.status(httpStatus.CREATED).send(kiet);
});

const getKiets = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await kietService.queryKiets(filter, options);
  res.send(result);
});

const getKiet = catchAsync(async (req, res) => {
  const kiet = await kietService.getKietById(req.params.kietId);
  if (!kiet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kiet not found');
  }
  res.send(kiet);
});

const updateKiet = catchAsync(async (req, res) => {
  const kiet = await kietService.updateKietById(req.params.kietId, req.body);
  res.send(kiet);
});

const deleteKiet = catchAsync(async (req, res) => {
  await kietService.deleteKietById(req.params.kietId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createKiet,
  getKiets,
  getKiet,
  updateKiet,
  deleteKiet,
};
