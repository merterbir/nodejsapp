const AuthService = require('../services/AuthService');

/** 
 * @class AuthController
 */

class AuthController {
    async login (request, response) {
        response.status(200).send(await AuthService.login(request, response));
    }
}

module.exports = new AuthController();