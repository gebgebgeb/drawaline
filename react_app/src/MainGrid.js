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
			, 'hintLevel': 3
			, 'stats': {}
		}
		this.setTemplate = this.setTemplate.bind(this)
		this.setOneStroke = this.setOneStroke.bind(this)
		this.setHintLevel = this.setHintLevel.bind(this)
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
	setHintLevel(val){
		let newState = Object.assign({}, this.state)
		newState['hintLevel'] = val
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
									hintLevel={this.state.hintLevel}
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
									hintLevel={this.state.hintLevel}
									setOneStroke={this.setOneStroke}
									setHintLevel={this.setHintLevel}
								/>
							</Col>
						</Row>
					</Col>
					<Col xs='2'>
						<Stats />
					</Col>
				</Row>
			</Container>
		)
	}
}

function Stats(){
	return(
		'Stats!'
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
