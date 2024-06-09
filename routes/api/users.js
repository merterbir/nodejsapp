const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/UsersController');

router.route('/')
    .get(UsersController.getAllUsers)
    .post(UsersController.createNewUser);
    

router.route('/:mail')
    .get(UsersController.getUser)
    .put(UsersController.updateUser)
    .delete(UsersController.deleteUser);

router.route('/transfer')
    .post(UsersController.balanceTransfer);

module.exports = router;