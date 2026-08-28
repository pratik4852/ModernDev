const { Settings, Audience } = require("../models");

const mappedAudienceInclude = {
  model: Audience,
  as: "mappedAudience",
};

const formatSettings = (settings) => {
  if (!settings) return null;

  const data = settings.toJSON();

  if (data.mappedAudience) {
    data.audience = data.mappedAudience;
  }

  delete data.mappedAudience;
  return data;
};

const mapAudienceIdFromName = async (data) => {
  if (data.audienceId || !data.audience || typeof data.audience !== "string") {
    return data;
  }

  const audience = await Audience.findOne({
    where: { audience: data.audience },
  });

  if (!audience) {
    return data;
  }

  return {
    ...data,
    audienceId: audience.id,
  };
};

const createSettings = async (data) => {
  const settingsData = await mapAudienceIdFromName(data);
  const settings = await Settings.create(settingsData);

  const result = await Settings.findByPk(settings.id, {
    include: [mappedAudienceInclude],
  });

  return formatSettings(result);
};

const getAllSettings = async () => {
  const settings = await Settings.findAll({
    include: [mappedAudienceInclude],
    order: [["id", "DESC"]],
  });

  return settings.map(formatSettings);
};

const getSettingsById = async (id) => {
  const settings = await Settings.findByPk(id, {
    include: [mappedAudienceInclude],
  });

  return formatSettings(settings);
};

const updateSettings = async (id, data) => {
  const settings = await Settings.findByPk(id);

  if (!settings) {
    throw new Error("Settings not found");
  }

  const settingsData = await mapAudienceIdFromName(data);
  await settings.update(settingsData);

  const result = await Settings.findByPk(id, {
    include: [mappedAudienceInclude],
  });

  return formatSettings(result);
};

const deleteSettings = async (id) => {
  const deletedCount = await Settings.destroy({
    where: { id },
  });

  if (!deletedCount) {
    throw new Error("Settings not found");
  }

  return true;
};

module.exports = {
  createSettings,
  getAllSettings,
  getSettingsById,
  updateSettings,
  deleteSettings,
};
