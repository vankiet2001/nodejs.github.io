const httpStatus = require('http-status');
const { Kiet } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a kiet
 * @param {Object} kietBody
 * @returns {Promise<Kiet>}
 */
const createKiet = async (kietBody) => {
  if (await Kiet.isEmailTaken(kietBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Kiet.create(kietBody);
};

/**
 * Query for kiets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryKiets = async (filter, options) => {
  const kiets = await Kiet.paginate(filter, options);
  return kiets;
};

/**
 * Get kiet by id
 * @param {ObjectId} id
 * @returns {Promise<Kiet>}
 */
const getKietById = async (id) => {
  return Kiet.findById(id);
};

/**
 * Get kiet by email
 * @param {string} email
 * @returns {Promise<Kiet>}
 */
const getKietByEmail = async (email) => {
  return Kiet.findOne({ email });
};

/**
 * Update kiet by id
 * @param {ObjectId} kietId
 * @param {Object} updateBody
 * @returns {Promise<Kiet>}
 */
const updateKietById = async (kietId, updateBody) => {
  const kiet = await getKietById(kietId);
  if (!kiet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kiet not found');
  }
  if (updateBody.email && (await Kiet.isEmailTaken(updateBody.email, kietId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(kiet, updateBody);
  await kiet.save();
  return kiet;
};

/**
 * Delete kiet by id
 * @param {ObjectId} kietId
 * @returns {Promise<Kiet>}
 */
const deleteKietById = async (kietId) => {
  const kiet = await getKietById(kietId);
  if (!kiet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kiet not found');
  }
  await kiet.remove();
  return kiet;
};

module.exports = {
  createKiet,
  queryKiets,
  getKietById,
  getKietByEmail,
  updateKietById,
  deleteKietById,
};
