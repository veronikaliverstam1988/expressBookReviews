const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password required" });
	}

	if (users.some((user) => user.username === username)) {
		return res.status(400).json({ message: "Username already exists" });
	}

	users.push({ username, password });
	return res.status(200).json({ message: "User registered successfully" });
});

// Get all books (working version)
public_users.get("/books", function (req, res) {
	return res.status(200).json(books);
});

// Get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	const book = books[isbn];

	if (book) {
		return res.status(200).json(book);
	} else {
		return res.status(404).json({ message: "Book not found" });
	}
});

// Get books by author
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author.toLowerCase();
	const results = [];

	for (const isbn in books) {
		if (books[isbn].author.toLowerCase().includes(author)) {
			results.push(books[isbn]);
		}
	}

	if (results.length > 0) {
		return res.status(200).json(results);
	} else {
		return res
			.status(404)
			.json({ message: "No books found by this author" });
	}
});

// Get books by title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title.toLowerCase();
	const results = [];

	for (const isbn in books) {
		if (books[isbn].title.toLowerCase().includes(title)) {
			results.push(books[isbn]);
		}
	}

	if (results.length > 0) {
		return res.status(200).json(results);
	} else {
		return res
			.status(404)
			.json({ message: "No books found with this title" });
	}
});

// Get book reviews
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;
	const book = books[isbn];

	if (book && book.reviews) {
		return res.status(200).json(book.reviews);
	} else {
		return res
			.status(404)
			.json({ message: "No reviews found for this book" });
	}
});

module.exports.general = public_users;
