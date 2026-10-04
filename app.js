require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.use('/', require('./routes/auth.routes'));        // /login, /auth
app.use('/hello', require('./routes/hello.routes'));  // /hello (có middleware)

app.listen(process.env.PORT, () => {
  console.log(`Server chạy tại http://localhost:${process.env.PORT}`);
});