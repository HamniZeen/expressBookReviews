const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;
const url='https://hamnizeen-5050.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/';


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({message: "Please provide username and password."});
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(400).json({message: "Username already exists."});
    }
  
    const user = {
      username: username,
      password: password
    };
    users.push(user);
  
    return res.status(200).json({message: "User registered successfully."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
     //Write your code here
    res.send(JSON.stringify(books));
  
});

async function get_books() {
    let book_list = (await axios.get(url)).data;

    return book_list;
}

async function get_book_by_isbn(isbn) {
    let book = (await axios.get(url + 'isbn/'+ isbn)).data;

    return book;
}

async function get_book_by_author(author) {
    let book = (await axios.get(url + 'author/'+ author)).data;

    return book;
}

async function get_book_by_title(title) {
    let book = (await axios.get(url + 'title/'+ title)).data;

    return book;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
  const book = books.find(b => b.isbn === isbn);
  if (book) {
    res.send(JSON.stringify(book));
  }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    let filtered_books = [];
    for (let i = 0; i < bookKeys.length; i++) {
        let key = bookKeys[i];
        let book = books[key];
        if (book.author === author) {
        filtered_books.push(book);
        }
    }
  res.send(JSON.stringify(filtered_books));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let filtered_books = [];
    for (let i = 0; i < bookKeys.length; i++) {
        let key = bookKeys[i];
        let book = books[key];
        if (book.title === title) {
        filtered_books.push(book);
        }
    }
  res.send(JSON.stringify(filtered_books));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      const reviews = books[isbn].reviews;
      res.send(JSON.stringify(reviews));
    } else {
      res.send(`Book with ISBN ${isbn} not found.`);
    }
});

module.exports.general = public_users;
