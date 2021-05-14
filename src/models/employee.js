const mongoose = require('mongoose')
const { omit } = require('lodash')
const { USER_STATUS } = require('../constants')

const Schema = mongoose.Schema

const EmployeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    organizationName: {
      type: String,
      default: 'Antarctica',
      required: true,
    },
    status: {
      type: String,
      default: USER_STATUS[0],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

EmployeeSchema.static('omitSensitiveFields', function (Document) {
  return omit(Document.toJSON(), ['password'])
})

module.exports = mongoose.model('employees', EmployeeSchema)
