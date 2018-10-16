import React, {Component} from 'react'
import {Button, ButtonGroup} from 'reactstrap'

class Settings extends Component{
	render(){
		return(
      <div>
				<ButtonGroup>
					<Button color="primary" disabled={this.props.oneStroke} 
						onClick={this.props.evaluate}
					>Evaluate
					</Button>
					<Button color="primary" 
						onClick={this.props.resetCanvas}
					>Reset
					</Button>
				</ButtonGroup>
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
