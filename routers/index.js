const Router = require('koa-router')

const axios = require('axios')

const router = new Router()

router.get('/all_templates', async (ctx, next) => {
	await next()
	const dirnames = ['circle1', 'line0', 'line1', 'line2', 'line3']
	let out = []
	for(let dirname of dirnames){
		let res = await axios.get(`http://localhost:9999/templates/${dirname}/metadata.json`)
		metadata = res.data
		metadata.dirname = dirname
		out.push(metadata)
	}
	ctx.body = out
})

module.exports = router
