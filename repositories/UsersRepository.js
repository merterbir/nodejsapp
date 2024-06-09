/**
 * @class Users
 */
class Users {
    /**
     * @returns 
     */
    databaseConnect = () => {
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

    /**
     * @returns {Promise<Object[]>}
     */
    getUser(mail) {
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
                    resolve({ status: 404, message: `Users not found` });
                    return;
                }
                if (!results[0]) {
                    resolve({ status: 404, message: `${mail} not found` });
                    return;
                }
    
                resolve(results[0]);
            });
    
            databaseConnection.end();
        });
    }

    /**
     * @returns {Promise<Object[]>}
     */
    getAllUsers() {
        return new Promise((resolve, reject) => {
            const databaseConnection = this.databaseConnect();
    
            const sql = 'SELECT * FROM users';
    
            databaseConnection.query(sql, (err, results) => {
                if (err) {
                    resolve({ status: 400, message: `${err.stack}` });
                    return;
                }
    
                resolve(results);
            });
    
            databaseConnection.end();
        })
    }

    /**
     * @param request
     * @returns {Promise<Object[]>}
     */
    createNewUser(request) {
        return new Promise((resolve, reject) => {
            const databaseConnection = this.databaseConnect();
    
            const newUser = {
                mail: request.body.mail,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                balance:  request.body.balance ?? 0
            }
    
            if (!newUser.firstName || !newUser.lastName || !newUser.mail) {
                resolve({ status: 400, message: 'Mail, first and last names are required.' });
                return;
            }
    
            const sql = 'INSERT INTO users (mail, firstName, lastName, balance) VALUES (?, ?, ?, ?)';
            const values = [newUser.mail, newUser.firstName, newUser.lastName, newUser.balance];
            
            databaseConnection.query(sql, values, (err, result) => {
                if (err) {
                    resolve({ status: 400, message: `${err.stack}` });
                    return;
                }
    
                resolve(newUser);
            });
    
            databaseConnection.end();
        })
    }

    /**
     * @param request
     * @returns {Promise<Object[]>}
     */
    updateUser(request, email) {
        return new Promise((resolve, reject) => {
            const databaseConnection = this.databaseConnect();
    
            const sql = 'SELECT * FROM users WHERE mail = ?';
            const values = [email];
    
            databaseConnection.query(sql, values, (err, results) => {
                if (err) {
                    databaseConnection.end();
                    resolve({ status: 401, message: `${err.stack}` });
                    return;
                }
                if (results.length === 0) {
                    databaseConnection.end();
                    resolve({ status: 402, message: `Users not found` });
                    return;
                }
                if (!results[0]) {
                    databaseConnection.end();
                    resolve({ status: 403, message: `${email} not found` });
                    return;
                }
            
                if (request.body.firstName) results[0].firstName = request.body.firstName;
                if (request.body.lastName) results[0].lastName = request.body.lastName;
                if (request.body.balance) results[0].balance = request.body.balance;
                if (request.body.mail) results[0].mail = request.body.mail;
            
                const sql = 'UPDATE users SET id = ?, mail = ?, firstName = ?, lastName = ?, balance = ? WHERE id = ?';
                const values = [results[0].id, results[0].mail, results[0].firstName, results[0].lastName, results[0].balance, results[0].id];
            
                databaseConnection.query(sql, values, (err, result) => {
                    databaseConnection.end();
                    if (err) {
                        resolve({ status: 404, message: `${err.stack}` });
                        return;
                    }
                    resolve({ status: 200, message: "Users updated", user: results[0] });
                });
            });
        })
    }

    /**
     * @param request
     * @returns {Promise<Object[]>}
     */
    deleteUser(email) {
        return new Promise((resolve, reject) => {
            const databaseConnection = this.databaseConnect();
    
            const sql = 'DELETE FROM users WHERE mail = ?';
            const values = [email];
    
            databaseConnection.query(sql, values, (err, result) => {
                databaseConnection.end();
                if (err) {
                    resolve({ status: 401, message: `${err.stack}` });
                    return;
                }

                resolve({ status: 200, message: `Deleted user: ${email}` });
            });
        })
    }

    /**
     * @param request
     * @returns {Promise<Object[]>}
     */
    balanceTransfer(request) {
        return new Promise((resolve, reject) => {
            const senderMail = request.body.senderMail;
            const receiverMail = request.body.receiverMail;
            const amount = request.body.amount;
    
            if (!senderMail || !receiverMail || !amount) {
                resolve({ status: 400, message: 'Sender mail, receiver mail, and amount are required.' });
                return;
            }

            if (senderMail === receiverMail) {
                resolve({ status: 400, message: 'Sender mail and receiver mail can not be same.' });
                return;
            }
    
            const connection = this.databaseConnect();
    
            connection.query('SELECT * FROM users WHERE mail = ?', [senderMail], (err, senderResults) => {
                if (err) {
                    connection.end();
                    resolve({ status: 500, message: 'Error retrieving sender information.' });
                    return;
                }
    
                if (senderResults.length === 0) {
                    connection.end();
                    resolve({ status: 404, message: 'Sender not found.' });
                    return;
                }
    
                const sender = senderResults[0];
                if (sender.balance < amount) {
                    connection.end();
                    resolve({ status: 400, message: 'Insufficient balance.' });
                    return;
                }
    
                connection.query('SELECT * FROM users WHERE mail = ?', [receiverMail], (err, receiverResults) => {
                    if (err) {
                        connection.end();
                        resolve({ status: 500, message: 'Error retrieving receiver information.' });
                        return;
                    }
    
                    if (receiverResults.length === 0) {
                        connection.end();
                        resolve({ status: 404, message: 'Receiver not found.' });
                        return;
                    }
    
                    const receiver = receiverResults[0];
    
                    const newSenderBalance = sender.balance - amount;
                    const newReceiverBalance = receiver.balance + amount;
    
                    connection.beginTransaction(err => {
                        if (err) {
                            connection.end();
                            resolve({ status: 500, message: 'Error starting transaction.' });
                            return;
                        }
    
                        connection.query('UPDATE users SET balance = ? WHERE mail = ?', [newSenderBalance, senderMail], (err, updateSenderResult) => {
                            if (err) {
                                connection.rollback(() => {
                                    connection.end();
                                    resolve({ status: 500, message: 'Error updating sender balance.' });
                                });
                                return;
                            }
    
                            connection.query('UPDATE users SET balance = ? WHERE mail = ?', [newReceiverBalance, receiverMail], (err, updateReceiverResult) => {
                                if (err) {
                                    connection.rollback(() => {
                                        connection.end();
                                        resolve({ status: 500, message: 'Error updating receiver balance.' });
                                    });
                                    return;
                                }
    
                                connection.commit(err => {
                                    if (err) {
                                        connection.rollback(() => {
                                            connection.end();
                                            resolve({ status: 500, message: 'Error committing transaction.' });
                                        });
                                        return;
                                    }
    
                                    connection.end();
                                    resolve({ status: 200, message: 'Transfer successful.' });
                                });
                            });
                        });
                    });
                });
            });
        })
    }
}

module.exports = new Users();