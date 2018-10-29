const PORT = process.env.PORT || 9999;
const Koa = require('koa')
const cors = require('@koa/cors')
const bodyparser = require('koa-bodyparser')
const staticRouter = require('koa-static')
//const passport = require('koa-passport')
//const session = require('koa-session')
const helmet = require('koa-helmet')

const path = require('path')

const indexRouter = require('./routers/index')

const app = new Koa()

app
.use(helmet())
.use(cors())
.use(bodyparser())
//.use(passport.initialize())
//.use(passport.session())
.use(staticRouter('build'))
.use(staticRouter('public'))
.use(indexRouter.routes())

app.listen(PORT)
console.log('Listening on port ' + PORT)
