const express = require('express');
const UserController = require('../controllers/userController');
const userController = new UserController();
const usersRouter = express.Router();

usersRouter.get('/', userController.getUsersList);

usersRouter.get('/:id', userController.getUser);

usersRouter.post('/', userController.createUser);

usersRouter.post('/login', userController.loginUser);

usersRouter.put("/:id", userController.updateUser);

usersRouter.delete('/:id', userController.deleteUser);

module.exports = usersRouter;
