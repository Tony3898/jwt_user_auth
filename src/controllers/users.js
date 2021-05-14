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
