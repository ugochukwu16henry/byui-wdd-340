const db = require("./database");

async function test() {
  try {
    const result = await db.query("SELECT * FROM classification;");
    console.log(result.rows);
  } catch (err) {
    console.error("Database test failed:", err);
  }
}

test();
