const CronService = require('../services/CronService');
/** 
 * @class CronController
 */

class CronController {    
    getUsersBalance () {
       CronService.getUsersBalance();
    }
}

module.exports = new CronController();