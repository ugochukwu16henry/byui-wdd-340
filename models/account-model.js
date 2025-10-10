const pool = require("../database/");

const accountModel = {};

/* ===== Register new account ===== */
accountModel.registerAccount = async (firstname, lastname, email, password) => {
  try {
    const sql = `
      INSERT INTO account
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *`;
    const result = await pool.query(sql, [
      firstname,
      lastname,
      email,
      password,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Account registration error:", error);
    return null;
  }
};

/* ===== Get account by email ===== */
accountModel.getAccountByEmail = async (account_email) => {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password
      FROM account
      WHERE account_email = $1`;
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountByEmail:", error);
    return null;
  }
};

/* ===== Get account by ID ===== */
accountModel.getAccountById = async (account_id) => {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1`;
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getAccountById:", error);
    return null;
  }
};

/* ===== Update account info (first, last, email) ===== */
accountModel.updateAccountInfo = async (
  account_id,
  firstname,
  lastname,
  email
) => {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *`;
    const result = await pool.query(sql, [
      firstname,
      lastname,
      email,
      account_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating account info:", error);
    return null;
  }
};

/* ===== Update password ===== */
accountModel.updatePassword = async (account_id, hashedPassword) => {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *`;
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating password:", error);
    return null;
  }
};

module.exports = accountModel;
