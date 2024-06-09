const cron = require('node-cron');
const mysql = require('mysql2');

/**
 * @class Crons
 */
class Crons {
    /**
     * @returns 
     */
    databaseConnect = () => {    
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

    async getUsersBalance() {
        const databaseConnection = this.databaseConnect();

        cron.schedule('0 4 * * *', async () => {
            try {
                const emails = await getEmails();
                for (const email of emails) {
                try {
                    const sql = 'SELECT * FROM users WHERE mail = ?';
                    const values = [email];
            
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
                            resolve({ status: 404, message: `${email} not found` });
                            return;
                        }
                        const currentDate = new Date();
                        const dateString = currentDate.toString();

                        return new Promise((resolve, reject) => {
                            const sql = 'INSERT INTO userbalances (userMail, userBalance, date) VALUES (?, ?, ?)';
                            const values = [results[0].mail, results[0].balance, dateString];

                            databaseConnection.query(sql, values, (err, result) => {
                                if (err) {
                                    resolve({ status: 400, message: `${err.stack}` });
                                    return;
                                }
                                
                                resolve(result);
                            });
                        });
                    });
                } catch (err) {
                    console.error(`E-posta için balance kontrolü veya güncellemesi yapılırken hata oluştu (${email}):`, err);
                }
                }
            } catch (err) {
                console.error('Veritabanından e-posta çekerken hata oluştu:', err);
            }
        });

        function getEmails() {
            return new Promise((resolve, reject) => {
                databaseConnection.query('SELECT userMail FROM checkusersbalance', (err, results) => {
                if (err) {
                  return reject(err);
                }
                resolve(results.map(user => user.userMail));
              });
            });
          }
    }
}

module.exports = new Crons();