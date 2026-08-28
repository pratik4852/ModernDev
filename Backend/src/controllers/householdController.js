const householdService = require("../services/householdService");

// Create
const createHousehold = async (req, res) => {
  try {
    const data = req.body;
    const household = await householdService.createHousehold(data);

    res.status(201).json({
      success: true,
      data: household,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all
const getAllHouseholds = async (req, res) => {
  try {
    const households = await householdService.getAllHousehold();

    res.status(200).json({
      success: true,
      data: households,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get by ID
const getHouseholdById = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await householdService.getHouseholdById(id);

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found",
      });
    }

    res.status(200).json({
      success: true,
      data: household,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update
const updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedHousehold = await householdService.updateHousehold(id, data);

    res.status(200).json({
      success: true,
      data: updatedHousehold,
    });
  } catch (error) {
    res.status(error.message === "Household not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
const deleteHousehold = async (req, res) => {
  try {
    const { id } = req.params;

    await householdService.deleteHousehold(id);

    res.status(200).json({
      success: true,
      message: "Household deleted successfully",
    });
  } catch (error) {
    res.status(error.message === "Household not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHousehold,
  getAllHouseholds,
  getHouseholdById,
  updateHousehold,
  deleteHousehold,
};