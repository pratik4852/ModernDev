const notificationService = require("../services/notificationService");

const formatNotification = (req, notification) => {
  if (!notification) {
    return notification;
  }

  const plainNotification =
    typeof notification.toJSON === "function"
      ? notification.toJSON()
      : notification;

  return {
    ...plainNotification,
    imageUrl: plainNotification.image
      ? `${req.protocol}://${req.get("host")}/uploads/${plainNotification.image}`
      : null,
  };
};

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file ? req.file.filename : null,
    };

    const result = await notificationService.createNotification(data);

    res.status(201).json(formatNotification(req, result));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await notificationService.getAllNotifications();
    res.json(data.map((notification) => formatNotification(req, notification)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const data = await notificationService.getNotificationById(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(formatNotification(req, data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatePayload = {
      ...req.body,
    };

    if (req.file) {
      updatePayload.image = req.file.filename;
    }

    const data = await notificationService.updateNotification(
      req.params.id,
      updatePayload
    );

    res.json(formatNotification(req, data));
  } catch (error) {
    if (error.message === "Notification not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);

    res.json({
      message: "Notification deleted",
    });
  } catch (error) {
    if (error.message === "Notification not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};


exports.toggle = async (req, res) => {
  try {
    const data = await notificationService.toggleNotification(
      req.params.id
    );

    res.json(formatNotification(req, data));
  } catch (error) {
    if (error.message === "Notification not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};
