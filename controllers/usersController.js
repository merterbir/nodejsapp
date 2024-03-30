const databaseConnect = () => {
    const mysql = require('mysql2');

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '130669',
        database: 'ledger_db'
    });

    connection.connect((err) => {
        if (err) {
            console.error('MySQL connection failed: ' + err.stack);
            return;
        }
        console.log('MySQL connected, connection id: ' + connection.threadId);
    });

    return connection;
};

const createNewUser = (req, res) => {
    const databaseConnection = databaseConnect();

    const newUser = {
        mail: req.body.mail,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        balance:  req.body.balance ?? 0
    }

    if (!newUser.firstName || !newUser.lastName || !newUser.mail) {
        return res.status(400).json({ 'message': 'Mail, first and last names are required.' });
    }

    const sql = 'INSERT INTO users (mail, firstName, lastName, balance) VALUES (?, ?, ?, ?)';
    const values = [newUser.mail, newUser.firstName, newUser.lastName, newUser.balance];
    
    databaseConnection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(400).json({ "message": `${err.stack}` });
        }

        return res.status(200).json(newUser);
    });

    databaseConnection.end();
}

const updateUser = (req, res) => {
    const databaseConnection = databaseConnect();

    const email = req.body.mail;
    const sql = 'SELECT * FROM users WHERE mail = ?';
    const values = [email];

    databaseConnection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(401).json({ "message": `${err.stack}` });
        }
        if (results.length === 0) {
            return res.status(402).json({ "message": `Users not found` });
        }
        if (!results[0]) {
            return res.status(403).json({ "message": `${ req.body.mail } not found` });
        }
    
        if (req.body.firstName) results[0].firstName = req.body.firstName;
        if (req.body.lastName) results[0].lastName = req.body.lastName;
        if (req.body.balance) results[0].balance = req.body.balance;
        if (req.body.mail) results[0].mail = req.body.mail;
    
        const sql = 'UPDATE users SET id = ?, mail = ?, firstName = ?, lastName = ?, balance = ? WHERE id = ?';
        const values = [results[0].id, results[0].mail, results[0].firstName, results[0].lastName, results[0].balance, results[0].id];
    
        databaseConnection.query(sql, values, (err, result) => {
            if (err) {
                databaseConnection.end();

                return res.status(404).json({ "message": `${err.stack}` });
            }
            databaseConnection.end();

            return res.status(200).json({ "Users updated": results[0] });
        });
    });
}

const getAllUsers = (req, res) => {
    const databaseConnection = databaseConnect();

    const sql = 'SELECT * FROM users';

    databaseConnection.query(sql, (err, results) => {
        if (err) {
            return res.status(400).json({ "message": `${err.stack}` });
        }

        return res.status(200).json(results);
    });

    databaseConnection.end();
}

const getUser = (req, res) => {
    const databaseConnection = databaseConnect();

    const email = req.params.mail;
    const sql = 'SELECT * FROM users WHERE mail = ?';
    const values = [email];

    databaseConnection.query(sql, values, (err, results) => {
        if (err) {
            return res.status(401).json({ "message": `${err.stack}` });
        }
        if (results.length === 0) {
            return res.status(402).json({ "message": `Users not found` });
        }
        if (!results[0]) {
            return res.status(403).json({ "message": `${req.params.mail} not found` });
        }
    
        res.status(200).json(results[0]);
    });

    databaseConnection.end();
}

const deleteUser = (req, res) => {
    const databaseConnection = databaseConnect();

    const userId = req.body.mail;
    const sql = 'DELETE FROM users WHERE mail = ?';
    const values = [userId];

    databaseConnection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(401).json({ "message": `${err.stack}` });
        }

        return res.status(200).json({ "Deleted user": `${userId}` });
    });

    databaseConnection.end();
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}