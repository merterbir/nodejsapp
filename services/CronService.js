const CronRepository = require('../repositories/CronRepository');

/**
 * class CronService
 */
class CronService {
    getUsersBalance () {
        CronRepository.getUsersBalance();
    }  
}

module.exports = new CronService();
