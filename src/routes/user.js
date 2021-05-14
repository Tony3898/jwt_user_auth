const express = require('express')
const Joi = require('joi')
const UserController = require('../controllers/users')
const AuthRouter = express.Router({ mergeParams: true })

AuthRouter.route('/').get(UserController.getUsers)

module.exports = AuthRouter
