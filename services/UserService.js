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
    async getUser (request, res) {
        const userName = request.params.mail;
        let user = {};

        if (userName) {
            try {  
                return await UsersRepository.getUser(userName, request);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }

        return user;
    }

    async getAllUsers (request, res) {
        try {
            return await UsersRepository.getAllUsers(request);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * @async
     * @param {Object} request
     * @returns {Promise<Object>}
     */
    async createNewUser (request, res) {
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
    async updateUser (request, res) {
        const userName = request.params.mail;
        let user = {};

        if (userName) {
            try {
                return await UsersRepository.updateUser(request, userName);
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
    async deleteUser (request, res) {
        const userName = request.params.mail;

        if (userName) {
            try {
                return await UsersRepository.deleteUser(userName);
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
    async balanceTransfer (request, res) {
        try {
            return await UsersRepository.balanceTransfer(request);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }    
}

module.exports = new UserService();
