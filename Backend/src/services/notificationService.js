const Notification = require("../models/notifications");


const createNotification = async (data) => {
  return await Notification.create(data);
};


const getAllNotifications = async () => {
  return await Notification.findAll({
    order: [["createdAt", "DESC"]],
  });
};


const getNotificationById = async (id) => {
  return await Notification.findByPk(id);
};


const updateNotification = async (id, data) => {
  const notification = await Notification.findByPk(id);

  if (!notification) {
    throw new Error("Notification not found");
  }

  await notification.update(data);
  return notification;
};


const deleteNotification = async (id) => {
  const deletedCount = await Notification.destroy({
    where: { id },
  });

  if (!deletedCount) {
    throw new Error("Notification not found");
  }

  return true;
};


const toggleNotification = async (id) => {
  const notification = await Notification.findByPk(id);

  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.is_active = !notification.is_active;
  await notification.save();

  return notification;
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  toggleNotification,
};
