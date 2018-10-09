const Router = require('koa-router')
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

router.get('/all_templates', async function (ctx, next) {
	const db = await dbConnect()
	const templates = db.collection('templates')
	const template_data = await templates.find({}).toArray()
	ctx.body = template_data
	await next
})

module.exports = router
