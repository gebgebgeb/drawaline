class Line {
	constructor(){
		this.leftEndpoint = {'x': 100, 'y': 250}
		this.rightEndpoint = {'x': 400, 'y': 250}
	}

	draw(ctx){
		ctx.beginPath()
		ctx.moveTo(this.leftEndpoint.x, this.leftEndpoint.y);
		ctx.lineTo(this.rightEndpoint.x, this.rightEndpoint.y);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#990000';
		ctx.stroke();
	}
}
class Circle {
	constructor(){
		this.center = {'x': 250, 'y': 250}
		this.radius = 200
	}

	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI, false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#990000';
		ctx.stroke();
	}
}

class Template{
	constructor(dataDir){
		this.templateImage = new Image();
		this.templateImage.src = './res/templates/' + dataDir + '/template.png';
		this.guideImage = new Image();
		this.guideImage.src = './res/templates/' + dataDir + '/guide.png';
	}

	drawGuide(ctx){
		ctx.drawImage(this.guideImage, 0, 0);
	}
	drawTemplate(ctx){
		ctx.drawImage(this.templateImage, 0, 0);
	}

	score(){
		// create a hidden canvas to draw the template image on
		let canvas = document.createElement("canvas");
		canvas.width = this.templateImage.width;
		canvas.height = this.templateImage.height;
		let templateCtx = canvas.getContext("2d");
		templateCtx.drawImage(this.templateImage, 0, 0);

		let templateImageData = templateCtx.getImageData(0,0,500,500);
		let imageData = ctx.getImageData(0,0,500,500);

		// get positions of drawn and template pixels
		let templatePositions = []
		let drawnPositions = []
		for(let j=0; j < templateImageData.data.length; j+= 4){
			if(templateImageData.data[j] === (9*16+9)){
				templatePositions.push({'x': (j/4)%500, 'y': Math.floor((j/4)/500)})
			}
		}
		canvas.style.display = 'none';
		for(let j=1; j < imageData.data.length; j+= 4){
			if(imageData.data[j] === (9*16+9)){
				drawnPositions.push({'x': (j/4)%500, 'y': Math.floor((j/4)/500)})
			}
		}

		// compute distances between template and drawing 
		let loss = 0;
		let tloss = 0;
		for(let tpos of templatePositions){
			let smallestDist = Number.MAX_VALUE;
			for(let dpos of drawnPositions){
				let d = distance(dpos, tpos);
				if(d < smallestDist){
					smallestDist = d;
				}
			}
			tloss += smallestDist;
		}
		let dloss = 0
		for(let dpos of drawnPositions){
			let smallestDist = Number.MAX_VALUE;
			for(let tpos of templatePositions){
				let d = distance(dpos, tpos);
				if(d < smallestDist){
					smallestDist = d;
				}
			}
			dloss += smallestDist;

		}
		return(tloss/templatePositions.length + dloss/templatePositions.length);
	}
}

const drawColor = '#009900'
const templateColor = '#990000'
const c = document.getElementById("drawingArea");
const ctx = c.getContext("2d");
const shape = new Template('circle1'); // see res/templates for options

let down = false;
let lastMousePos;

var guideImageLoaded = new Promise(function(resolve, reject){
	shape.guideImage.onload = function(){
		resolve();
	}
});

var templateImageLoaded = new Promise(function(resolve, reject){
	shape.templateImage.onload = function(){
		resolve();
	}
});

Promise.all([guideImageLoaded, templateImageLoaded]).then(function(){
	shape.drawGuide(ctx);

	c.addEventListener('mousedown', function(evt){
		down = true;
		ctx.clearRect(0, 0, c.width, c.height);
		shape.drawGuide(ctx);
		lastMousePos = getMousePos(c, evt);
	})
	c.addEventListener('mouseup', function(evt){
		down = false;  
		console.log(shape.score());
		shape.drawTemplate(ctx);
	});
	c.addEventListener('mousemove', draw);
})

function distance(pos1, pos2){
	return Math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2);
}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left
		, y: evt.clientY - rect.top
	};
}

function draw(evt){
	if (down) {
		const mousePos = getMousePos(c, evt);
		ctx.beginPath();
		ctx.moveTo(lastMousePos.x, lastMousePos.y);
		ctx.lineTo(mousePos.x, mousePos.y);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#009900';
		ctx.stroke();
		lastMousePos = mousePos;
	}
}

