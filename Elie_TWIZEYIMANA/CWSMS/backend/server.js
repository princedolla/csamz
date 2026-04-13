require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Beginner-friendly log to confirm server startup.
  console.log(`CWSMS backend server is running on port ${PORT}`);
});
