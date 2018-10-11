const Koa = require('koa')
const cors = require('@koa/cors')
const bodyparser = require('koa-bodyparser')
const path = require('path')

const indexRouter = require('./routers/index')

const app = new Koa()

app
.use(cors())
.use(bodyparser())
.use(indexRouter.routes())

app.listen(9999)
