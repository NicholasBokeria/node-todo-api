require('./config/config.js');

const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index.routes');
const helmet = require('helmet');
const cors = require('cors');
const mongoose= require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use(helmet());
app.use(cors());

app.use('/api/user', routes.user);
app.use('/api/post', routes.post);


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});