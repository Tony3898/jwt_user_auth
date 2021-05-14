const jwt = require('jsonwebtoken')

const { JWT_SECRET, ALLOWED_POST_ROUTES, ALLOWED_GET_ROUTES } = require('../config')

exports.validate = (req, res, next) => {
  const { method, path: route } = req
  if (method === 'GET' && ALLOWED_GET_ROUTES.includes(route.trim())) return next()
  if (method === 'POST' && ALLOWED_POST_ROUTES.includes(route.trim())) return next()

  const bearer = req.headers['authorization']
  if (!bearer) return res.status(401).send('Token not found!')
  else {
    const token = bearer.split(' ')[1]
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return res.status(401).send('Invalid token!')
      req.jwtPayload = payload
      next()
    })
  }
}

exports.sign = payload => jwt.sign(payload, JWT_SECRET, { expiresIn: '30 days' })
