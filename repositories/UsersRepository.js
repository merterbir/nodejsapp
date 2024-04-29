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
}

module.exports = new Users();