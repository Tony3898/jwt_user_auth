const db = require('./src/utils/mongodb')
const { PORT } = require('./src/config')
const app = require('./src/app')

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} environment!`)
  })
})
