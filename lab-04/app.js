
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MY_SECRET_KEY";
const app = express();

const dbPath = "./users.db";

let db = null;

app.use(express.json());
app.post("/register/", async (request, response) => {
  const { username, name, password } = request.body;

  // Check whether all details are provided
  if (!username || !name || !password) {
    return response.status(400).send("All fields are required");
  }

  // Check whether username already exists
  const existingUser = await db.get(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (existingUser) {
    return response.status(400).send("User already exists");
  }

  // Convert password into a hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user in database
  await db.run(
    `INSERT INTO users (username, name, password)
     VALUES (?, ?, ?)`,
    [username, name, hashedPassword]
  );

  response.send("User registered successfully");
});
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;

  // Check whether user exists
  const existingUser = await db.get(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (!existingUser) {
    return response.status(400).send("Invalid user");
  }

  // Compare entered password with hashed password
  const isPasswordMatched = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordMatched) {
    return response.status(400).send("Invalid password");
  }

  const payload = {
  username: username,
};

const jwtToken = jwt.sign(payload, JWT_SECRET);

response.send({
  jwt_token: jwtToken,
});
});

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100),
        password VARCHAR(255)
      );
    `);

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });

  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
