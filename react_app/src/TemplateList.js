import React, {Component} from 'react';
import axios from 'axios';

class TemplateGroup extends Component{
	render(){
		const options = this.props.options.map((option)=>
			<li key={option.title} onClick={()=>this.props.handleClick(option)}>
				{option.title}
			</li>
		)
		return(
			<div>
				<li>{this.props.groupTitle}</li>
				<ul>
					{options}
				</ul>
			</div>
		)
	}
}

class TemplateList extends Component{
	constructor(props){
		super(props)
		this.state = {'groups':[]}
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
				groups[group].sort()
			}
			_this.setState({'groups': groups})
		})
	}

	render(){
		let templateGroups = []
		for(let group of Object.keys(this.state['groups'])){
			templateGroups.push(<TemplateGroup
				groupTitle={group}
				options={this.state['groups'][group]}
				key={group}
				handleClick={this.props.handleClick}
			/>)
		}
		return(
			<ul>
				{templateGroups}
			</ul>
		)
	}
}

export default TemplateList;
