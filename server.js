const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
//const CronController = require('./controllers/CronController');

const PORT = process.env.PORT || 3500;

app.use(logger);

const whitelist = ['http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/', require('./routes/api/users'));
//CronController.getUsersBalance();
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));