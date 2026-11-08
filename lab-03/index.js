
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

// Initialize Database and Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create book table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        book_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        author_id INTEGER,
        price REAL
      );
    `);

    // Add author_id to an existing database if missing
    const columns = await db.all("PRAGMA table_info(book);");

    const hasAuthorId = columns.some(
      (column) => column.name === "author_id"
    );

    if (!hasAuthorId) {
      await db.exec(`
        ALTER TABLE book ADD COLUMN author_id INTEGER;
      `);
    }

    console.log("Database initialized successfully");

    // GET All Books with Filtering, Sorting and Pagination
    app.get("/books", async (request, response) => {
      const {
        search_q = "",
        order_by = "book_id",
        order = "ASC",
        limit = 5,
        offset = 0,
        min_price,
        max_price,
      } = request.query;

      const allowedColumns = [
        "book_id",
        "title",
        "author",
        "author_id",
        "price",
      ];

      if (!allowedColumns.includes(order_by)) {
        return response.status(400).send({
          message: "Invalid order_by column",
        });
      }

      if (!["ASC", "DESC"].includes(order.toUpperCase())) {
        return response.status(400).send({
          message: "Order must be ASC or DESC",
        });
      }

      if (
        !Number.isInteger(Number(limit)) ||
        !Number.isInteger(Number(offset)) ||
        Number(limit) <= 0 ||
        Number(offset) < 0
      ) {
        return response.status(400).send({
          message: "Invalid limit or offset",
        });
      }

      // Validate price filters
      if (
        (min_price !== undefined &&
          !Number.isFinite(Number(min_price))) ||
        (max_price !== undefined &&
          !Number.isFinite(Number(max_price)))
      ) {
        return response.status(400).send({
          message: "Invalid price filter",
        });
      }

      if (
        min_price !== undefined &&
        max_price !== undefined &&
        Number(min_price) > Number(max_price)
      ) {
        return response.status(400).send({
          message: "Minimum price cannot exceed maximum price",
        });
      }

      let conditions = [];
      let values = [];

      if (search_q !== "") {
        conditions.push("title LIKE ?");
        values.push(`%${search_q}%`);
      }

      if (min_price !== undefined) {
        conditions.push("price >= ?");
        values.push(Number(min_price));
      }

      if (max_price !== undefined) {
        conditions.push("price <= ?");
        values.push(Number(max_price));
      }

      let getBooksQuery = `
        SELECT *
        FROM book
      `;

      if (conditions.length > 0) {
        getBooksQuery += " WHERE " + conditions.join(" AND ");
      }

      getBooksQuery += `
        ORDER BY ${order_by} ${order.toUpperCase()}
        LIMIT ? OFFSET ?;
      `;

      values.push(Number(limit), Number(offset));

      const booksArray = await db.all(getBooksQuery, values);

      response.send(booksArray);
    });

    // GET Book by ID
    app.get("/books/:bookId", async (request, response) => {
      const { bookId } = request.params;

      if (
        !Number.isInteger(Number(bookId)) ||
        Number(bookId) <= 0
      ) {
        return response.status(400).send({
          message: "Invalid book ID",
        });
      }

      const getBookQuery = `
        SELECT *
        FROM book
        WHERE book_id = ?;
      `;

      const book = await db.get(getBookQuery, [bookId]);

      if (book === undefined) {
        return response.status(404).send({
          message: "Book not found",
        });
      }

      response.send(book);
    });

    // POST Add Book
    app.post("/books", async (request, response) => {
      const { title, author, authorId, price } = request.body;

      if (
        !title ||
        !author ||
        price === undefined
      ) {
        return response.status(400).send({
          message: "Title, author and price are required",
        });
      }

      if (
        typeof price !== "number" ||
        !Number.isFinite(price)
      ) {
        return response.status(400).send({
          message: "Price must be a number",
        });
      }

      if (
        authorId !== undefined &&
        (!Number.isInteger(authorId) || authorId <= 0)
      ) {
        return response.status(400).send({
          message: "Invalid author ID",
        });
      }

      const addBookQuery = `
        INSERT INTO book (title, author, author_id, price)
        VALUES (?, ?, ?, ?);
      `;

      await db.run(addBookQuery, [
        title,
        author,
        authorId ?? null,
        price,
      ]);

      response.status(201).send({
        message: "Book added successfully",
      });
    });

    // PUT Update Book
    app.put("/books/:bookId", async (request, response) => {
      const { bookId } = request.params;
      const { title, author, authorId, price } = request.body;

      if (
        !Number.isInteger(Number(bookId)) ||
        Number(bookId) <= 0
      ) {
        return response.status(400).send({
          message: "Invalid book ID",
        });
      }

      const checkBookQuery = `
        SELECT * FROM book
        WHERE book_id = ?;
      `;

      const existingBook = await db.get(
        checkBookQuery,
        [bookId]
      );

      if (existingBook === undefined) {
        return response.status(404).send({
          message: "Book not found",
        });
      }

      if (!title || !author || price === undefined) {
        return response.status(400).send({
          message: "Title, author and price are required",
        });
      }

      if (
        typeof price !== "number" ||
        !Number.isFinite(price)
      ) {
        return response.status(400).send({
          message: "Price must be a number",
        });
      }

      if (
        authorId !== undefined &&
        (!Number.isInteger(authorId) || authorId <= 0)
      ) {
        return response.status(400).send({
          message: "Invalid author ID",
        });
      }

      const updateBookQuery = `
        UPDATE book
        SET title = ?,
            author = ?,
            author_id = ?,
            price = ?
        WHERE book_id = ?;
      `;

      await db.run(updateBookQuery, [
        title,
        author,
        authorId ?? existingBook.author_id,
        price,
        bookId,
      ]);

      response.status(200).send({
        message: "Book updated successfully",
      });
    });

    // DELETE Book
    app.delete("/books/:bookId", async (request, response) => {
      const { bookId } = request.params;

      if (
        !Number.isInteger(Number(bookId)) ||
        Number(bookId) <= 0
      ) {
        return response.status(400).send({
          message: "Invalid book ID",
        });
      }

      const checkBookQuery = `
        SELECT * FROM book
        WHERE book_id = ?;
      `;

      const existingBook = await db.get(
        checkBookQuery,
        [bookId]
      );

      if (existingBook === undefined) {
        return response.status(404).send({
          message: "Book not found",
        });
      }

      const deleteBookQuery = `
        DELETE FROM book
        WHERE book_id = ?;
      `;

      await db.run(deleteBookQuery, [bookId]);

      response.status(200).send({
        message: "Book deleted successfully",
      });
    });

    // GET Books by Author ID
    app.get(
      "/authors/:authorId/books",
      async (request, response) => {
        const { authorId } = request.params;

        if (
          !Number.isInteger(Number(authorId)) ||
          Number(authorId) <= 0
        ) {
          return response.status(400).send({
            message: "Invalid author ID",
          });
        }

        const getAuthorBooksQuery = `
          SELECT *
          FROM book
          WHERE author_id = ?;
        `;

        const booksArray = await db.all(
          getAuthorBooksQuery,
          [authorId]
        );

        response.send(booksArray);
      }
    );

    // Start Server
    app.listen(3000, () => {
      console.log(
        "Server Running at http://localhost:3000/"
      );
    });

  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
