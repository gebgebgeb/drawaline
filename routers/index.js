const Router = require('koa-router')

const axios = require('axios')

const PORT = process.env.PORT || 9999;
const URL = process.env.HEROKU_URL || 'http://localhost'
const AXIOS_BASE_URL = URL + ':' + PORT

const router = new Router()

router.get('/all_templates', async (ctx, next) => {
	await next()
	const dirnames = ['circle1', 'line0', 'line1', 'line2', 'line3']
	let out = []
	for(let dirname of dirnames){
		let res = await axios.get(AXIOS_BASE_URL + `/templates/${dirname}/metadata.json`)
		metadata = res.data
		metadata.dirname = dirname
		out.push(metadata)
	}
	ctx.body = out
})

module.exports = router
