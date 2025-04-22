const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

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

// Get all books
public_users.get("/books", function (req, res) {
	return res.status(200).json(books);
});

// Get all books (async version)
public_users.get("/async/books", async (req, res) => {
	try {
		const allBooks = await new Promise((resolve) => {
			resolve(books);
		});
		return res.status(200).json(allBooks);
	} catch (error) {
		return res.status(500).json({ message: "Error fetching books" });
	}
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

// Get book by ISBN (async version)
public_users.get("/async/isbn/:isbn", async (req, res) => {
	try {
		const book = await new Promise((resolve, reject) => {
			const isbn = req.params.isbn;
			books[isbn] ? resolve(books[isbn]) : reject("Book not found");
		});
		return res.status(200).json(book);
	} catch (error) {
		return res.status(404).json({ message: error });
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

// Get books by author (async version)
public_users.get("/async/author/:author", async (req, res) => {
	try {
		const filteredBooks = await new Promise((resolve) => {
			const author = req.params.author.toLowerCase();
			const results = Object.values(books).filter((book) =>
				book.author.toLowerCase().includes(author)
			);
			resolve(results);
		});
		return filteredBooks.length > 0
			? res.status(200).json(filteredBooks)
			: res.status(404).json({ message: "No books found by this author" });
	} catch (error) {
		return res.status(500).json({ message: "Error fetching books" });
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

// Get books by title (async version)
public_users.get("/async/title/:title", async (req, res) => {
	try {
		const filteredBooks = await new Promise((resolve) => {
			const title = req.params.title.toLowerCase();
			const results = Object.values(books).filter((book) =>
				book.title.toLowerCase().includes(title)
			);
			resolve(results);
		});
		return filteredBooks.length > 0
			? res.status(200).json(filteredBooks)
			: res.status(404).json({ message: "No books found with this title" });
	} catch (error) {
		return res.status(500).json({ message: "Error fetching books" });
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
