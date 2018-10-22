const Router = require('koa-router')
const passport = require('koa-passport');

const fileCmd = require('file-cmd')
const MongoClient = require('mongodb').MongoClient

const router = new Router()

async function dbConnect(){
	const url = 'mongodb://localhost:27017'
	const dbName = 'drawing_dev'
	const client = await MongoClient.connect(url)
	const db = client.db(dbName)
	return db
}

router.get('/all_templates', async (ctx, next) => {
	const db = await dbConnect()
	const templates = db.collection('templates')
	const template_data = await templates.find({}).toArray()
	ctx.body = template_data
	await next
})

/*
router.post('/login', async (ctx) => {
  passport.authenticate('local')
})

router.get('/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})
*/

module.exports = router
