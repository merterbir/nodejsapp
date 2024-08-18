const { request } = require('express');
const AuthRepository = require('../repositories/AuthRepository');

/**
 * class AuthService
 */
class AuthService {
    async login (request, response) {
        return await AuthRepository.login(request, response);
    }  
}

module.exports = new AuthService();
