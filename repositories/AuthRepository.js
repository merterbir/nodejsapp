const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @class Auth
 */
class Auth {
    databaseConnect = () => {
        const mysql = require('mysql2');

        const connection = mysql.createConnection({
            host: 'nodedatabase.c1e8q0k8opto.eu-north-1.rds.amazonaws.com',
            user: 'admin',
            password: 'Test123+',
            database: 'nodedatabase'
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

    login = (request, response) => {
        const { mail, password } = request.body;
        const secretKey = 'ledgerAppSecretKey';

        return new Promise((resolve, reject) => {
            const databaseConnection = this.databaseConnect();
    
            const sql = 'SELECT * FROM users WHERE mail = ?';
            const values = [mail];
        
            databaseConnection.query(sql, values, (err, results) => {
                if (err) {
                    resolve({ status: 500, message: `${err.stack}` });
                    return;
                }
                if (results.length === 0) {
                    resolve({ status: 404, message: `User not found` });
                    return;
                }

                if (results[0]) {
                    const passwordIsValid = password === results[0].password;

                    if (!passwordIsValid) {
                        return resolve({ status: 401, message: 'Wrong password' });
                    }

                    const token = jwt.sign({ id: mail, role: results[0].role }, secretKey, {
                        expiresIn: 8640
                    });
                
                    response.status(200).send({ auth: true, token });
                }
            });
        });
    };
}

module.exports = new Auth();