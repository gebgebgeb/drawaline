import React, {Component} from 'react'
import {Button, ButtonGroup} from 'reactstrap'

class Settings extends Component{
	constructor(props){
		super(props)
		this.state = {'evaluateEvent': new Event('evaluate')}
	}
	evaluate(){
		let canvas = document.getElementById('drawingArea');
		canvas.dispatchEvent(this.state.evaluateEvent)
	}
	render(){
		return(
      <div>
				<div>
					<Button color="primary" disabled={this.props.oneStroke} 
						onClick={()=>this.evaluate()}
					>Evaluate
					</Button>
				</div>
				<div>
					<h5>Auto evaluate after one stroke?</h5>
					<ButtonGroup>
						<Button color="primary" onClick={() => this.props.setOneStroke(true)} active={this.props.oneStroke}>Yes</Button>
						<Button color="primary" onClick={() => this.props.setOneStroke(false)} active={!this.props.oneStroke}>No</Button>
					</ButtonGroup>
				</div>
				<div>
					<h5>Hint level</h5>
					<ButtonGroup>
						<Button color="primary" onClick={() => this.props.setHintLevel(1)} active={this.props.hintLevel >= 1}>1</Button>
						<Button color="primary" onClick={() => this.props.setHintLevel(2)} active={this.props.hintLevel >= 2}>2</Button>
						<Button color="primary" onClick={() => this.props.setHintLevel(3)} active={this.props.hintLevel >= 3}>3</Button>
					</ButtonGroup>
				</div>

			</div>
		)
	}
}


export default Settings;
