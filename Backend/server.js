require("dotenv").config();

console.log("🚀 Starting server...");

try {
  const app = require("./app");
  const sequelize = require("./src/config/database");

  const start = async () => {
    try {
      console.log("ENV CHECK:");
      console.log("DB_HOST:", process.env.DB_HOST);
      console.log("DB_USER:", process.env.DB_USER);
      console.log("DB_NAME:", process.env.DB_NAME);
      console.log("DB_PORT:", process.env.DB_PORT);
      await sequelize.authenticate();
      console.log("✅ Database connected");

      // 🔥 ADD THIS (IMPORTANT)
      if (process.env.DB_SYNC === "true") {
        await sequelize.sync({ alter: true });
        console.log("✅ DB synced");
      } else {
        console.log("⏭️ DB sync skipped");
      }

      const tables = await sequelize.getQueryInterface().showAllTables();
      console.log("Tables in DB:", tables);

      const PORT = process.env.PORT || 5000;

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error("❌ Startup error:", err);
    }
  };

  start();
} catch (err) {
  console.error("❌ CRASH BEFORE START:", err);
}
