// generateToken.js
const jwt = require("jsonwebtoken");

// Your secret from .env - USE THE SAME ONE IN YOUR APP!
const secret = "d7f4a9e1b2c830f7e5d619a4c8f3b0d2e6c1a5f8b9e7d2c4a6b8f3e1d5a9c0";

// Create token
const token = jwt.sign({ userId: 123, username: "testuser" }, secret, {
	expiresIn: "1h",
});

console.log("YOUR TEST TOKEN:");
console.log(token);
console.log("\nTest it with:");
console.log(
	`curl http://localhost:5001/customer/auth/test -H "Authorization: Bearer ${token}"`
);
