const userModel = require('../models/users')
const { paginateWithAggregation } = require('../utils/hooks')

exports.getUsers = async (req, res, next) => {
  try {
    let { firstName, lastName, employeeId, organizationName, ...query } = req.query
    if (firstName) query['firstName'] = new RegExp(firstName, 'gi')
    if (lastName) query['lastName'] = new RegExp(lastName, 'gi')
    if (organizationName) query['organizationName'] = new RegExp(organizationName, 'gi')
    if (employeeId) query['employeeId'] = new RegExp(employeeId, 'gi')
    const pipeline = [
      {
        $lookup: {
          from: 'employees',
          as: 'employeeData',
          localField: 'userId',
          foreignField: 'employeeId',
        },
      },
      {
        $unwind: {
          path: '$employeeData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          employeeData: 1,
          firstName: 1,
          lastName: 1,
          organizationName: 1,
          status: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
          employeeId: 1,
          _id: 1,
        },
      },
    ]
    const _users = await paginateWithAggregation(userModel, query, pipeline)
    res.status(200).send(_users)
  } catch (e) {
    next(e)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    let employeeId = req.params.employeeId
    let updates = req.body
    let user = await userModel.findOneAndUpdate({ employeeId }, { ...updates }, { new: true })
    if (!user) throw new Error('User not found')
    let _user = await userModel.omitSensitiveFields(user)
    res.status(200).send(_user)
  } catch (e) {
    next(e)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    let employeeId = req.params.employeeId
    let exists = await userModel.exists({ employeeId })
    if (!exists) throw new Error('User not found')
    let user = await userModel.deleteOne({ employeeId })
    res.status(200).send(user)
  } catch (e) {
    next(e)
  }
}
