import React, {Component} from 'react';
import axios from 'axios';

import styles from './styles'

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

class TemplateGroup extends Component{
	render(){
		const { classes } = this.props;
		const options = this.props.options.map((option)=>
			<ListItem 
				key={option.title} 
				onClick={()=>this.props.setTemplate(option)}
				button
				className={classes.nested}
			>
				{option.title}
			</ListItem>
		)
		return(
			<div>
				<Collapse in={this.props.open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{options}
					</List>
				</Collapse>
			</div>
		)
	}
}
TemplateGroup = withStyles(styles)(TemplateGroup)

class TemplateList extends Component{
	constructor(props){
		super(props)
		this.state = {'groups':[]
			, 'curGroup': null
		}
		let _this = this
		axios.get('/all_templates').then(function(res){
			let all_templates = res.data
			let groups = {}
			for(let template of all_templates){
				let group = template['subcollection']
				if(group in groups){
					groups[group].push(template)
				}else{
					groups[group] = [template]
				}
			}
			for(let group of Object.keys(groups)){
				groups[group].sort((x,y)=>{
					if(x.title > y.title){return 1}
					if(x.title < y.title){return -1}
					return 0
				})
			}
			_this.setState({'groups': groups})
		})
	}

	setCurGroup = (group) => {
		this.setState({curGroup: group})
	}

	render(){
		let templateGroups = []
		for(let group of Object.keys(this.state['groups'])){
			templateGroups.push(
				<div key={group}>
					<Divider/>
					<ListItem 
						button onClick={()=>this.setCurGroup(group)}
					>
						<Typography variant="h6">
							{group}
						</Typography>
					</ListItem>
					<TemplateGroup
						options={this.state['groups'][group]}
						setTemplate={this.props.setTemplate}
						curTemplate={this.props.curTemplate}
						open={group===this.state.curGroup}
					/>
				</div>
			)
		}
		return(
			<List>
				{templateGroups}
			</List>
		)
	}
}

export default TemplateList;
