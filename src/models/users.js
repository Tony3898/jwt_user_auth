const mongoose = require('mongoose')
const { omit } = require('lodash')
const { USER_STATUS } = require('../constants')
const { slug } = require('../utils/hooks')

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
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
    password: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      default: USER_STATUS[0],
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
      default: 'Antarctica',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

UserSchema.static('omitSensitiveFields', function (Document) {
  return omit(Document.toJSON(), ['password'])
})

module.exports = mongoose.model('users', UserSchema)
