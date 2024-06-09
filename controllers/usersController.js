const UserService = require('../services/UserService');

/** 
 * @class UsersController
 */

class UsersController {
    async getUser (request, response) {
        response.status(200).send(await UserService.getUser(request));
    }

    async getAllUsers (request, response) {
        response.status(200).send(await UserService.getAllUsers());
    }

    async createNewUser (request, response) {
        response.status(200).send(await UserService.createNewUser(request));
    }

    async updateUser (request, response) {
        response.status(200).send(await UserService.updateUser(request));
    }

    async deleteUser (request, response) {
        response.status(200).send(await UserService.deleteUser(request));
    }

    async balanceTransfer (request, response) {
        response.status(200).send(await UserService.balanceTransfer(request));
    }
}

module.exports = new UsersController();