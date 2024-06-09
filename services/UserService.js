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
            try {  
                user = await UsersRepository.getUser(userName);
                res.status(200).json(user);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        return user;
    }

    async getAllUsers () {
        try {
            return await UsersRepository.getAllUsers();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * @async
     * @param {Object} request
     * @returns {Promise<Object>}
     */
    async createNewUser (request) {
        try {
            return await UsersRepository.createNewUser(request);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
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
            try {
                user = await UsersRepository.updateUser(request, userName);
                res.status(200).json(user);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
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
            try {
                user = await UsersRepository.deleteUser(userName);
                res.status(201).json(user);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        return user;
    }

    /**
     * @async
     * @param {Object} request
     * @returns {Promise<Object>}
     */
    async balanceTransfer (request) {
        try {
            return await UsersRepository.balanceTransfer(request);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }    
}

module.exports = new UserService();
