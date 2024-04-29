const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/usersController');

router.route('/')
    .get(UsersController.getAllUsers)
    .post(UsersController.createNewUser);
    

router.route('/:mail')
    .get(UsersController.getUser)
    .put(UsersController.updateUser)
    .delete(UsersController.deleteUser);

module.exports = router;