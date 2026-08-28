const settingsService = require("../services/settingsService");

const createSettings = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file ? req.file.filename : req.body.image,
    };

    const settings = await settingsService.createSettings(data);

    res.status(201).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSettings = async (req, res) => {
  try {
    const settings = await settingsService.getAllSettings();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSettingsById = async (req, res) => {
  try {
    const settings = await settingsService.getSettingsById(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const data = {
      ...req.body,
      ...(req.file ? { image: req.file.filename } : {}),
    };

    const settings = await settingsService.updateSettings(req.params.id, data);

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(error.message === "Settings not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSettings = async (req, res) => {
  try {
    await settingsService.deleteSettings(req.params.id);

    res.status(200).json({
      success: true,
      message: "Settings deleted successfully",
    });
  } catch (error) {
    res.status(error.message === "Settings not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSettings,
  getAllSettings,
  getSettingsById,
  updateSettings,
  deleteSettings,
};
