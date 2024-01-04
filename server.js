
require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const indexRouter = require('./route/index');

app.use('/', indexRouter);




app.listen(port, () =>
{
    console.log(`Server is running on port ${ port }`);
});
