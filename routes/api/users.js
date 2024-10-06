const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/usersController');
const AuthController = require('../../controllers/authController');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/',)
    .get(verifyRoles('Admin'), UsersController.getAllUsers)
    .post(verifyRoles('Admin'), UsersController.createNewUser);
    

router.route('/:mail')
    .get(verifyRoles('Admin', 'User'), UsersController.getUser)
    .put(verifyRoles('Admin'), UsersController.updateUser)
    .delete(verifyRoles('Admin'), UsersController.deleteUser);

router.route('/transfer')
    .post(verifyRoles('Admin', 'User'), UsersController.balanceTransfer);

router.route('/login')
    .post(AuthController.login);

module.exports = router;