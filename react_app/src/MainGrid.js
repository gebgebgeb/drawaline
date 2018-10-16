import React from 'react';

import {Container, Row, Col, Button} from 'reactstrap'
import TemplateList from './TemplateList'
import Settings from './Settings'


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

class MainGrid extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'curTemplate': null
			, 'guideImage': new Image()
			, 'templateImage': new Image()
			, 'oneStroke': true
			, 'showTemplate': false
			, 'firstStroke': true
			, 'mouseDown': false
			, 'lastMousePos': null
			, 'lastScore': 0
			, 'allScores': []
		}

		this.setTemplate = this.setTemplate.bind(this)
		this.setOneStroke = this.setOneStroke.bind(this)
		this.setShowTemplate = this.setShowTemplate.bind(this)
		this.setLastScore = this.setLastScore.bind(this)
		this.resetCanvas = this.resetCanvas.bind(this)
		this.mouseDownListener = this.mouseDownListener.bind(this)
		this.mouseUpListener = this.mouseUpListener.bind(this)
		this.mouseMoveListener = this.mouseMoveListener.bind(this)
		this.evaluate = this.evaluate.bind(this)
		this.clearHistory = this.clearHistory.bind(this)

		//window.localStorage.clear()
		let allScores = JSON.parse(window.localStorage.getItem('allScores'))
		if(allScores){
			for(let score of allScores){
				score.date = new Date(score.date)
			}
		}else{
			allScores = []
		}
		this.state.allScores = allScores
	}

	componentDidMount(){
		let c = document.getElementById('drawingArea');
		c.addEventListener('mousedown', this.mouseDownListener)
		c.addEventListener('mouseup', this.mouseUpListener)
		c.addEventListener('mousemove', this.mouseMoveListener)
	}

	mouseDownListener(evt){
		let c = document.getElementById('drawingArea')
		this.mouseDown = true;
		if(this.state.firstStroke || this.state.oneStroke){
			this.resetCanvas()
		}
		let newState = Object.assign({}, this.state)
		newState.firstStroke = false
		newState.lastMousePos = getMousePos(c, evt);
		this.setState(newState)
	}

	mouseUpListener(evt){
		this.mouseDown = false;  
		if(this.state.oneStroke){
			this.evaluate()
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

	evaluate(){
		let newState = Object.assign({}, this.state)
		newState.firstStroke = true
		this.setState(newState, ()=>{
			this.drawTemplate();
			this.setLastScore(this.score())
		})
	}

	setLastScore(val){
		let newState = Object.assign({}, this.state)
		newState.lastScore = val
		if(isFinite(val)){
			newState.allScores.unshift({
				'score':val
				, 'date': Date.now()
				, 'template': this.state.curTemplate.dirname
			})
			window.localStorage.setItem('allScores', JSON.stringify(newState.allScores))
		}
		this.setState(newState)
	}
	setTemplate(val){
		let newState = Object.assign({}, this.state)
		newState.curTemplate = val
		newState.templateImage.src = '/templates/' + val.dirname + '/template.png';
		newState.guideImage.src = '/templates/' + val.dirname + '/guide.png';
		const guideImageLoaded = new Promise(function(resolve, reject){
			newState.guideImage.onload = ()=>resolve()
		});
		const templateImageLoaded = new Promise(function(resolve, reject){
			newState.templateImage.onload = ()=>resolve()
		});
		Promise.all([guideImageLoaded, templateImageLoaded]).then(()=>{
			this.setState(newState, this.resetCanvas)
		})
	}
	setOneStroke(val){
		let newState = Object.assign({}, this.state)
		newState['oneStroke'] = val
		this.setState(newState, this.resetCanvas)
	}
	setShowTemplate(val){
		let newState = Object.assign({}, this.state)
		newState['showTemplate'] = val
		this.setState(newState, this.resetCanvas)
	}
	clearHistory(){
		window.localStorage.setItem('allScores', JSON.stringify([]))
		let newState = Object.assign({}, this.state)
		newState.allScores = []
		this.setState(newState)
	}

	resetCanvas(){
		let newState = Object.assign({}, this.state)
		newState.firstStroke = true
		this.setState(newState, ()=>{
			this.clearCanvas()
			this.drawGuide()
		})
	}
	clearCanvas(){
		let c = document.getElementById('drawingArea')
		let ctx = c.getContext('2d')
		ctx.clearRect(0, 0, c.width, c.height);
	}
	drawGuide(){
		let c = document.getElementById('drawingArea')
		let ctx = c.getContext('2d')
		ctx.drawImage(this.state.guideImage, 0, 0);
		if(this.state.showTemplate){
			this.drawTemplate()
		}
	}
	drawTemplate(){
		let ctx = document.getElementById('drawingArea').getContext('2d')
		ctx.drawImage(this.state.templateImage, 0, 0);
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
			<Container fluid={true}>
				<Row>
					<Col xs='2'>
						<TemplateList handleClick={this.setTemplate}/>
					</Col>
					<Col xs='8'>
						<Row>
							<Col>
								<Canvas />
							</Col>
						</Row>
						<Row>
							<Col>
								<Description template={this.state.curTemplate}/>
							</Col>
						</Row>
						<Row>
							<Col>
								<Settings
									oneStroke={this.state.oneStroke}
									showTemplate={this.state.showTemplate}
									setOneStroke={this.setOneStroke}
									setShowTemplate={this.setShowTemplate}
									evaluate={this.evaluate}
									resetCanvas={this.resetCanvas}
								/>
							</Col>
						</Row>
					</Col>
					<Col xs='2'>
						<Stats 
							lastScore={this.state.lastScore}
							allScores={this.state.allScores}
							curTemplate={this.state.curTemplate}
							clearHistory={this.clearHistory}
						/>
					</Col>
				</Row>
			</Container>
		)
	}
}

function Stats(props){
	let previousScores
	if(props.allScores === null){
		previousScores = []
	}else{
		previousScores = props.allScores.map((x)=>{
			let out=[]
			if(props.curTemplate){
				if(x.template === props.curTemplate.dirname){
					out.push(<li key={x.date}>{x.score.toFixed(2)}</li>)
				}
				return out
			}
			return null
		})
	}
	return(
		<div>
			<h4>Score: {props.lastScore.toFixed(2)}</h4>
			<Button color="primary"
				onClick={props.clearHistory}
			>Clear History
			</Button>
			<h4>Previous scores:</h4>
			<ul>
				{previousScores}
			</ul>
		</div>
	)
}

function Canvas(){
	return(
		<div>
			<canvas 
				id='drawingArea' 
				width='500' height='500' 
			/>
		</div>
	)
}

function Description(props){
	let description = ''
	if(props.template !== null){
		description = props.template.instructions
	}
	return(
		<div className='text-center'>
			<p className='lead'>
				{description}
			</p>
		</div>
	)
}

export default MainGrid;
