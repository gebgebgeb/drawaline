const PORT = process.env.PORT || 9999;
const Koa = require('koa')
const cors = require('@koa/cors')
const bodyparser = require('koa-bodyparser')
const staticRouter = require('koa-static')
const helmet = require('koa-helmet')

const indexRouter = require('./routers/index')

const app = new Koa()

app
.use(helmet())
.use(cors())
.use(bodyparser())
.use(staticRouter(__dirname + '/build'))
.use(indexRouter.routes())

app.listen(PORT)
console.log('Listening on port ' + PORT)
