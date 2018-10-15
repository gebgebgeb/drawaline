import React from 'react';

import {Container, Row, Col} from 'reactstrap'
import Canvas from './Canvas'
import TemplateList from './TemplateList'
import Settings from './Settings'

class MainGrid extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'curTemplate': null
			, 'oneStroke': true
			, 'showTemplate': false
			, 'stats': {}
			, 'lastScore': 0
			, 'allScores': null
		}

		this.setTemplate = this.setTemplate.bind(this)
		this.setOneStroke = this.setOneStroke.bind(this)
		this.setShowTemplate = this.setShowTemplate.bind(this)
		this.setLastScore = this.setLastScore.bind(this)

		//window.localStorage.clear()
		this.state.allScores = JSON.parse(window.localStorage.getItem('allScores'))
	}

	setLastScore(val){
		let newState = Object.assign({}, this.state)
		newState.lastScore = val
		if(newState.allScores === null){
			newState.allScores = []
		}
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
		newState['curTemplate'] = val
		this.setState(newState)
	}
	setOneStroke(val){
		let newState = Object.assign({}, this.state)
		newState['oneStroke'] = val
		this.setState(newState)
	}
	setShowTemplate(val){
		let newState = Object.assign({}, this.state)
		newState['showTemplate'] = val
		this.setState(newState)
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
								<Canvas 
									template={this.state.curTemplate}
									oneStroke={this.state.oneStroke}
									showTemplate={this.state.showTemplate}
									setLastScore={this.setLastScore}
								/>
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
								/>
							</Col>
						</Row>
					</Col>
					<Col xs='2'>
						<Stats 
							lastScore={this.state.lastScore}
							allScores={this.state.allScores}
							curTemplate={this.state.curTemplate}
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
			<h4>Previous scores:</h4>
			<ul>
				{previousScores}
			</ul>
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
