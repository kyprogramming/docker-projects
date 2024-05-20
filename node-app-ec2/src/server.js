const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const User = require("./models/user"); // Import the User model

var cors = require('cors');

const uri = "mongodb://host.docker.internal:27017/userDB?ssl=false";
const PORT = process.env.PORT || 8080;

const app = express();
// middleware
app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));

// host.docker.internal
const dbName = "userDB";
const redis = new Redis({
  host: "host.docker.internal", // Replace with your Redis server host
  port: 6379, // Default Redis port
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send(`A simple node js applicion (API) running on Docker Compose.`);
});
app.get("/contact", (req, res) => {
  res.send(`please contact Kumar Programming @kyprogramming`);
});

app.get("/mongodb-save", (req, res) => {
  const newUser = new User({
    name: "John Doe",
    email: "john@example.com",
    age: 30,
  });

  newUser
    .save()
    .then((savedUser) => {
      console.log("User saved:", savedUser);
      res.send(200,`User Saved - ${JSON.stringify(savedUser)}`);
    })
    .catch((error) => {
      console.error("Error saving user:", error);
    });
});

app.get("/mongodb-get", async (req, res) => {
  try {
    const items = await User.find();
    res.json(items);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
}
});


app.get("/redis-save", (req, res) => {
  redis
    .set("myKey", "myValue")
    .then(() => {
      console.log("Redis Value set successfully Updated");
      res.send(200,`Redis Value set successfully Updated for Key - myKey`);
    })
    .catch((err) => {
      console.error("Error setting value:", err);
    });
});

app.get("/redis-get", (req, res) => {
  redis
    .get("myKey")
    .then((value) => {
      console.log("Value retrieved:", value);
      res.send(200,JSON.stringify(value));
    })
    .catch((err) => {
      console.error("Error retrieving value:", err);
    });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
