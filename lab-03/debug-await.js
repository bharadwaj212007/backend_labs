
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "goodreads.db");

const testDatabase = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const query = "SELECT * FROM book;";

  // Intentionally missing await
  const result = await db.all(query);

  console.log(result);

  await db.close();
};

testDatabase();
