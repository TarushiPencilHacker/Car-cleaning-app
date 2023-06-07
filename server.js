require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app");

console.log(process.env.MONGODB_URL_LOCAL);
mongoose
  .connect(process.env.MONGODB_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("MongoDB connection failed!", err));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is running on port ${port}!`);
});
