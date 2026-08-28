const audienceService = require("../services/audienceService");

const createAudience = async (req, res) => {
  try {
    const audience = await audienceService.createAudience(req.body);

    res.status(201).json({
      success: true,
      data: audience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAudience = async (req, res) => {
  try {
    const audience = await audienceService.getAllAudience();

    res.status(200).json({
      success: true,
      data: audience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAudienceById = async (req, res) => {
  try {
    const audience = await audienceService.getAudienceById(req.params.id);

    if (!audience) {
      return res.status(404).json({
        success: false,
        message: "Audience not found",
      });
    }

    res.status(200).json({
      success: true,
      data: audience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAudience = async (req, res) => {
  try {
    const audience = await audienceService.updateAudience(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: audience,
    });
  } catch (error) {
    res.status(error.message === "Audience not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAudience = async (req, res) => {
  try {
    await audienceService.deleteAudience(req.params.id);

    res.status(200).json({
      success: true,
      message: "Audience deleted successfully",
    });
  } catch (error) {
    res.status(error.message === "Audience not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAudience,
  getAllAudience,
  getAudienceById,
  updateAudience,
  deleteAudience,
};
