const UserService = require('../services/UserService');

/** 
 * @class UsersController
 */

class UsersController {
    async getUser (request, response) {
        response.status(200).send(await UserService.getUser(request, response));
    }

    async getAllUsers (request, response) {
        response.status(200).send(await UserService.getAllUsers(request, response));
    }

    async createNewUser (request, response) {
        response.status(200).send(await UserService.createNewUser(request, response));
    }

    async updateUser (request, response) {
        response.status(200).send(await UserService.updateUser(request, response));
    }

    async deleteUser (request, response) {
        response.status(200).send(await UserService.deleteUser(request, response));
    }

    async balanceTransfer (request, response) {
        response.status(200).send(await UserService.balanceTransfer(request, response));
    }
}

module.exports = new UsersController();