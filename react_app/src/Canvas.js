import React from 'react';
//import axios from 'axios';

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

class Canvas extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'guideImage': new Image()
			, 'templateImage': new Image()
			, 'mouseDown': false
			, 'lastMousePos': null
			, 'firstStroke': true
			, 'currentDirname': null
			, 'currentShowTemplate': null
			, 'currentOneStroke': null
		}
		
		this.mouseDownListener = this.mouseDownListener.bind(this)
		this.mouseUpListener = this.mouseUpListener.bind(this)
		this.mouseMoveListener = this.mouseMoveListener.bind(this)
		this.evaluateListener = this.evaluateListener.bind(this)
	}
	componentDidMount(){
		let c = document.getElementById('drawingArea');
		c.addEventListener('mousedown', this.mouseDownListener)
		c.addEventListener('mouseup', this.mouseUpListener)
		c.addEventListener('mousemove', this.mouseMoveListener)
		c.addEventListener('evaluate', this.evaluateListener)
	}

	componentDidUpdate(){
		if(this.props.template === null){
			return
		}
		let dataDir = this.props.template.dirname

		if(this.state.currentDirname === dataDir 
			&& this.state.currentShowTemplate === this.props.showTemplate){
			return
		}

		let newState = Object.assign({}, this.state)
		if(this.state.currentOneStroke !== this.props.oneStroke){
			newState.firstStroke = true
		}
		newState.templateImage.src =  '/templates/' + dataDir + '/template.png';
		newState.guideImage.src =  '/templates/' + dataDir + '/guide.png';

		newState.currentDirname = dataDir
		newState.currentShowTemplate = this.props.showTemplate
		newState.currentOneStroke = this.props.oneStroke

		const guideImageLoaded = new Promise(function(resolve, reject){
			newState.guideImage.onload = ()=>resolve()
		});
		const templateImageLoaded = new Promise(function(resolve, reject){
			newState.templateImage.onload = ()=>resolve()
		});
		Promise.all([guideImageLoaded, templateImageLoaded]).then(()=>{
			this.drawGuide()
			this.setState(newState)
		})
	}

	drawGuide(){
		let c = document.getElementById('drawingArea')
		let ctx = c.getContext('2d')
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.drawImage(this.state.guideImage, 0, 0);
		if(this.props.showTemplate){
			ctx.drawImage(this.state.templateImage, 0, 0);
		}
	}

	drawTemplate(){
		let ctx = document.getElementById('drawingArea').getContext('2d')
		ctx.drawImage(this.state.templateImage, 0, 0);
	}

	mouseDownListener(evt){
		let c = document.getElementById('drawingArea')
		this.mouseDown = true;
		if(this.props.oneStroke || this.state.firstStroke){
			this.drawGuide();
		}
		let newState = Object.assign({}, this.state)
		newState.firstStroke = false
		newState.lastMousePos = getMousePos(c, evt);
		this.setState(newState)
	}

	mouseUpListener(evt){
		this.mouseDown = false;  
		if(this.props.oneStroke){
			let newState = Object.assign({}, this.state)
			newState.firstStroke = true
			this.props.setLastScore(this.score())
			this.drawTemplate();
		}
	}
	mouseMoveListener(evt){
		if (this.mouseDown) {
			let c = document.getElementById('drawingArea');
			let ctx = c.getContext('2d');
			const mousePos = getMousePos(c, evt);
			ctx.beginPath();
			ctx.moveTo(this.state.lastMousePos.x, this.state.lastMousePos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#009900';
			ctx.stroke();

			let newState = Object.assign({}, this.state)
			newState.lastMousePos = mousePos;
			this.setState(newState)
		}
	}
	evaluateListener(evt){
		let newState = Object.assign({}, this.state)
		newState.firstStroke = true
		this.setState(newState)
		this.props.setLastScore(this.score())
		this.drawTemplate();
	}

	score(){
		let canvas = document.getElementById('drawingArea')
		let ctx = canvas.getContext('2d')

		// create a hidden canvas to draw the template image on
		let templateCanvas = document.createElement("canvas");
		templateCanvas.width = this.state.templateImage.width;
		templateCanvas.height = this.state.templateImage.height;
		let templateCtx = templateCanvas.getContext("2d");
		templateCtx.drawImage(this.state.templateImage, 0, 0);

		let templateImageData = templateCtx.getImageData(0,0,500,500);
		let imageData = ctx.getImageData(0,0,500,500);

		// get position of template pixels
		let templatePositions = []
		for(let j=0; j < templateImageData.data.length; j+= 4){
			if(templateImageData.data[j] === (9*16+9)){
				templatePositions.push({'x': (j/4)%500, 'y': Math.floor((j/4)/500)})
			}
		}

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

export default Canvas;

