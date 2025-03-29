const jwt = require("jsonwebtoken");

exports.handler = async (event, context) => {

  const allowedOrigins = ["*"];

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigins,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
  }

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  // check if the method is POST
  if (event.httpMethod === "POST") {
    const {username, password} = JSON.parse(event.body);

    // Test credentials
    const testUser = {
      username: "testuser",
      password: "password",
    };

    // check that credentials match
    if (username === testUser.username && password === testUser.password) {
      // Generate JWT token
      const token = jwt.sign({ username: testUser.username }, process.env.JWT_SECRET, {expiresIn: "1h"});

      return {
        statusCode: 200,
        body: JSON.stringify({ token })
      };
    } else {
      // invalid credentials
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" })
      };
    }
  } else {
    // only allow post method
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" })
    };
  }
};
