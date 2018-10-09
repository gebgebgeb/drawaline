import React from 'react';
//import axios from 'axios';

class Canvas extends React.Component{
	constructor(props){
		super(props)
	}
	componentDidUpdate(){
		if(this.props.template === null){
			return
		}
		initializeShape(this.props.template.dirname
			, this.props.oneStroke
			, this.props.hintLevel
		);
	}
	render(){
		return(
			<div>
				<canvas 
					id='drawingArea' 
					width='500' height='500' 
				/>
			</div>
		)
	}
}

class Shape{
	constructor(dataDir){
		this.dataDir = dataDir

		this.templateImage = new Image();
		this.guideImage = new Image();
		this.templateImage.src =  '/templates/' + dataDir + '/template.png';
		this.guideImage.src =  '/templates/' + dataDir + '/guide.png';

		this.canvas = document.getElementById('drawingArea');
		this.ctx = this.canvas.getContext('2d');
	}

	drawGuide(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(this.guideImage, 0, 0);
	}
	drawTemplate(){
		this.ctx.drawImage(this.templateImage, 0, 0);
	}

	score(){
		// create a hidden canvas to draw the template image on
		let templateCanvas = document.createElement("canvas");
		templateCanvas.width = this.templateImage.width;
		templateCanvas.height = this.templateImage.height;
		let templateCtx = templateCanvas.getContext("2d");
		templateCtx.drawImage(this.templateImage, 0, 0);

		let templateImageData = templateCtx.getImageData(0,0,500,500);
		let imageData = this.ctx.getImageData(0,0,500,500);

		// get position of template pixels
		let templatePositions = []
		for(let j=0; j < templateImageData.data.length; j+= 4){
			if(templateImageData.data[j] === (9*16+9)){
				templatePositions.push({'x': (j/4)%500, 'y': Math.floor((j/4)/500)})
			}
		}
		//templateCanvas.style.display = 'none';

		// get position of drawn pixels
		let drawnPositions = []
		for(let j=1; j < imageData.data.length; j+= 4){
			if(imageData.data[j] === (9*16+9)){
				drawnPositions.push({'x': (j/4)%500, 'y': Math.floor((j/4)/500)})
			}
		}

		// compute distances between template and drawing 
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

let down = false;
let lastMousePos;

function initializeShape(dataDir, oneStroke, hintLevel){
	// remove old event handlers, if any
	let old_c = document.getElementById('drawingArea');
	let c = old_c.cloneNode(true)
	old_c.parentNode.replaceChild(c, old_c)

	let ctx = c.getContext('2d');

	const shape = new Shape(dataDir); // see res/templates for options
	let firstStroke = false

	const guideImageLoaded = new Promise(function(resolve, reject){
		shape.guideImage.onload = function(){
			resolve();
		}
	});

	const templateImageLoaded = new Promise(function(resolve, reject){
		shape.templateImage.onload = function(){
			resolve();
		}
	});

	Promise.all([guideImageLoaded, templateImageLoaded]).then(function(){
		shape.drawGuide(ctx);

		c.addEventListener('mousedown', function(evt){
			down = true;
			if(oneStroke || firstStroke){
				ctx.clearRect(0, 0, c.width, c.height);
				shape.drawGuide(ctx);
			}
			lastMousePos = getMousePos(c, evt);
		})
		c.addEventListener('mouseup', function(evt){
			down = false;  
			if(oneStroke){
				firstStroke = true
				console.log(shape.score());
				shape.drawTemplate(ctx);
			}
		});
		c.addEventListener('mousemove', draw);
		c.addEventListener('evaluate', function(evt){
			firstStroke = true
			console.log(shape.score());
			shape.drawTemplate(ctx);
		})
	})
	return shape;
}

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
		let c = document.getElementById('drawingArea');
		let ctx = c.getContext('2d');
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

export default Canvas;

