
require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
app.use(fileUpload());
app.use(cors())


const port = process.env.PORT || 3000;
// Middleware
app.use(express.json());

// Routes
const indexRouter = require('./route/index');

app.use('/', indexRouter);

const DB_URL = process.env.DB

mongoose.connect(DB_URL).then(() =>
{
    console.log("connected to db")
}).catch((err) =>
{
    console.log(err)
})



app.listen(port, () =>
{
    console.log(`Server is running on port ${ port }`);
});
