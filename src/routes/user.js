const express = require('express')
const Joi = require('joi')
const UserController = require('../controllers/users')
const validate = require('../middlewares/validate-request')
const UserRouter = express.Router({ mergeParams: true })

UserRouter.route('/').get(UserController.getUsers)

UserRouter.route('/:employeeId')
  .patch(
    validate(
      Joi.object().keys({
        body: {
          firstName: Joi.string(),
          lastName: Joi.string(),
          status: Joi.string(),
          organizationName: Joi.string(),
        },
      })
    ),
    UserController.updateUser
  )
  .delete(UserController.deleteUser)

module.exports = UserRouter
