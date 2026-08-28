const Household = require("../models/householdsmodel");

const createHousehold = async (data) => {
  return await Household.create(data);
};

const getAllHousehold = async () => {
  return await Household.findAll({
    order: [["id", "DESC"]],
  });
};

const getHouseholdById = async (id) => {
  return await Household.findByPk(id);
};

const updateHousehold = async (id, data) => {
  const household = await Household.findByPk(id);

  if (!household) {
    throw new Error("Household not found");
  }

  await household.update(data);
  return household;
};

const deleteHousehold = async (id) => {
  const deletedCount = await Household.destroy({
    where: { id },
  });

  if (!deletedCount) {
    throw new Error("Household not found");
  }

  return true;
};


module.exports = {
  createHousehold,
  getAllHousehold,
  getHouseholdById,
  updateHousehold,
  deleteHousehold,
};

