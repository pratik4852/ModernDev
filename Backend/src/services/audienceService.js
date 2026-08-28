const { Audience, User } = require("../models");

const mappedUserInclude = {
  model: User,
  as: "mappedUser",
  attributes: ["id", "username", "email", "gender", "mobile", "createdAt"],
};

const formatAudience = (audience) => {
  if (!audience) return null;

  const data = audience.toJSON();

  if (data.mappedUser) {
    data.users = data.mappedUser;
  }

  delete data.mappedUser;
  return data;
};

const mapUserIdFromName = async (data) => {
  if (data.userId || !data.users) {
    return data;
  }

  const user = await User.findOne({
    where: { username: data.users },
  });

  if (!user) {
    return data;
  }

  return {
    ...data,
    userId: user.id,
  };
};

const createAudience = async (data) => {
  const audienceData = await mapUserIdFromName(data);
  const audience = await Audience.create(audienceData);
  const result = await Audience.findByPk(audience.id, {
    include: [mappedUserInclude],
  });

  return formatAudience(result);
};

const getAllAudience = async () => {
  const audience = await Audience.findAll({
    include: [mappedUserInclude],
    order: [["id", "DESC"]],
  });

  return audience.map(formatAudience);
};

const getAudienceById = async (id) => {
  const audience = await Audience.findByPk(id, {
    include: [mappedUserInclude],
  });

  return formatAudience(audience);
};

const updateAudience = async (id, data) => {
  const audience = await Audience.findByPk(id);

  if (!audience) {
    throw new Error("Audience not found");
  }

  const audienceData = await mapUserIdFromName(data);
  await audience.update(audienceData);

  const result = await Audience.findByPk(id, {
    include: [mappedUserInclude],
  });

  return formatAudience(result);
};

const deleteAudience = async (id) => {
  const deletedCount = await Audience.destroy({
    where: { id },
  });

  if (!deletedCount) {
    throw new Error("Audience not found");
  }

  return true;
};

module.exports = {
  createAudience,
  getAllAudience,
  getAudienceById,
  updateAudience,
  deleteAudience,
};
