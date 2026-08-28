const Member = require("../models/membermodel");

const createMember = async (data) => {
  return await Member.create(data);
};

const getAllMembers = async () => {
  return await Member.findAll();
};

const getMembersByHousehold = async (householdId) => {
  return await Member.findAll({
    where: { householdId },
  });
};

const getMemberById = async (id) => {
  return await Member.findByPk(id);
};
const updateMember = async (id, data) => {
  const member = await Member.findByPk(id);

  if (!member) {
    throw new Error("Member not found");
  }

  return await member.update(data);
};
const deleteMember = async (id) => {
  const member = await Member.findByPk(id);

  if (!member) {
    throw new Error("Member not found");
  }

  await member.destroy();

  return true;
};
module.exports = {
  createMember,
  getAllMembers,
  getMembersByHousehold,
  getMemberById,
  updateMember,
  deleteMember,
};