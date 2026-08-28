const LMS = require("../models/lmsmodel");

const createLMS = async (data) => {
  return await LMS.create(data);
};

const getAllLMS = async () => {
  return await LMS.findAll({
    order: [["id", "DESC"]],
  });
};

const getLMSById = async (id) => {
  return await LMS.findByPk(id);
};

const updateLMS = async (id, data) => {
  const lms = await LMS.findByPk(id);

  if (!lms) {
    throw new Error("LMS not found");
  }

  await lms.update(data);
  return lms;
};

const deleteLMS = async (id) => {
  const deletedCount = await LMS.destroy({
    where: { id },
  });

  if (!deletedCount) {
    throw new Error("LMS not found");
  }

  return true;
};

const toggleLMS = async (id) => {
  const lms = await LMS.findByPk(id);

  if (!lms) {
    throw new Error("LMS not found");
  }

  lms.is_active = !lms.is_active;
  await lms.save();

  return lms;
};

module.exports = {
  createLMS,
  getAllLMS,
  getLMSById,
  updateLMS,
  deleteLMS,
  toggleLMS,
};

