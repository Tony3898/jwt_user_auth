const { passwordHashing, slug, passwordComparing } = require('../utils/hooks')
const userModel = require('../models/users')
const employeeModel = require('../models/employee')
const { USER_STATUS } = require('../constants')
const { sign } = require('../middlewares/jsonWebToken')

exports.registerUser = async (req, res, next) => {
  try {
    let { firstName, lastName, organizationName, password, email } = req.body
    if (!email || !password) throw new Error('Email/Password missing')
    let userExisted = await userModel.exists({ email })
    if (userExisted) throw new Error(`sorry! but ${email} already exists`)
    let employeeId = await slug(email.trim().split('@')[0])
    password = await passwordHashing(password)
    await userModel.create({ firstName, lastName, password, email, employeeId, organizationName })
    let newEmployee = await employeeModel.create({ firstName, lastName, employeeId, email, organizationName })
    res.status(200).send(newEmployee)
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password: currentPassword } = req.body
    if (!email) throw new Error('Please provide email')
    let user = await userModel.findOne({ email }).select('+password')
    if (!user) throw new Error('Email is not register')
    if (user.status !== USER_STATUS[0]) throw new Error(`User is ${user.status}`)
    const { password: savedPassword, ...userData } = user.toJSON()
    const passwordMatch = await passwordComparing(currentPassword, savedPassword)
    if (!passwordMatch) throw new Error('Password mismatch')
    userData.token = sign({ ...userData, type: 'user' })
    res.status(200).send(userData)
  } catch (e) {
    next(e)
  }
}
