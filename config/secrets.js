require('dotenv').config();

exports.config = {
  db_pass: process.env.PASS_DB,
  db_user: process.env.USER_DB,
  token_secret: process.env.TOKEN_SECRET,
  db_url: '',
  email_pass:process.env.EMAIL_PASS
}