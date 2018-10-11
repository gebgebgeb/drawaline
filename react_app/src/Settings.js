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
					<h5>Show Template?</h5>
					<ButtonGroup>
						<Button color="primary" onClick={() => this.props.setShowTemplate(true)} active={this.props.showTemplate}>Yes</Button>
						<Button color="primary" onClick={() => this.props.setShowTemplate(false)} active={!this.props.showTemplate}>No</Button>
					</ButtonGroup>
				</div>

			</div>
		)
	}
}


export default Settings;
