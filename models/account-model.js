const pool = require("../database/");

const accountModel = {};

accountModel.registerAccount = async function (
  firstname,
  lastname,
  email,
  password
) {
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

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = accountModel;
