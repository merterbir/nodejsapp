const UsersRepository = require('../repositories/UsersRepository');

/**
 * class UserService
 */
class UserService {
    /**
     * @async
     * @param {Object} request
     * @param {Object} request.params
     * @param {Object} request.params.mail
     * @returns {Promise<Object>}
     */
    async getUser (request) {
        const userName = request.params.mail;
        let user = {};

        if (userName) {
            user = await UsersRepository.getUser(userName);
        }

        return user;
    }

    async getAllUsers () {
        return await UsersRepository.getAllUsers();
    }

    /**
     * @async
     * @param {Object} request
     * @returns {Promise<Object>}
     */
    async createNewUser (request) {
        return await UsersRepository.createNewUser(request);
    }

    /**
     * @async
     * @param {Object} request
     * @param {Object} request.params
     * @param {Object} request.params.mail
     * @param {Object} request
     * @returns {Promise<Object>}
     */
    async updateUser (request) {
        const userName = request.params.mail;
        let user = {};

        if (userName) {
            user = await UsersRepository.updateUser(request, userName);
        }

        return user;
    }

    /**
     * @async
     * @param {Object} request
     * @param {Object} request.params
     * @param {Object} request.params.mail
     * @param {Object} request
     * @returns {Promise<Object>}
     */
    async deleteUser (request) {
        const userName = request.params.mail;
        let user = {};

        if (userName) {
            user = await UsersRepository.deleteUser(userName);
        }

        return user;
    }  
}

module.exports = new UserService();
