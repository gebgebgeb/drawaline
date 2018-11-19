const Router = require('koa-router')
const axios = require('axios')
const url = require('url')

const PORT = process.env.PORT || 9999;
const MY_URL = new URL(process.env.PRODUCTION_URL || 'http://localhost/')
MY_URL.port = PORT
const AXIOS_BASE_URL = MY_URL.origin

const router = new Router()

router.get('/all_templates', async (ctx, next) => {
	await next()
	console.log('we made it this far ################')
	console.log(AXIOS_BASE_URL)
	const dirnames = ['circle1', 'line0', 'line1', 'line2', 'line3']
	let out = []
	for(let dirname of dirnames){
		console.log('dirname' + '****************')
		console.log(AXIOS_BASE_URL + `/templates/${dirname}/metadata.json`)
		let res = await axios.get(AXIOS_BASE_URL + `/templates/${dirname}/metadata.json`)
		metadata = res.data
		metadata.dirname = dirname
		out.push(metadata)
	}
	ctx.body = out
})

module.exports = router
