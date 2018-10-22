import React, {Component} from 'react'

import styles from './styles'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class Settings extends Component{
	render(){
		const { classes } = this.props;
		return(
      <List>
				<ListItem>
					<Button 
						variant='outlined'
						color="primary" 
						disabled={this.props.oneStroke} 
						onClick={this.props.evaluate}
					>
						Evaluate
					</Button>
					<Button 
						variant='outlined'
						color="primary" 
						onClick={this.props.resetCanvas}
					>
						Reset
					</Button>
				</ListItem>
				<ListItem>
					<Typography variant='h6'>Auto evaluate after one stroke?</Typography>
				</ListItem>
				<ListItem>
					<Button 
						variant={ this.props.oneStroke ? 'contained' : 'outlined' }
						color="primary" 
						onClick={() => this.props.setOneStroke(true)} 
					>
						Yes
					</Button>
					<Button 
						variant={ this.props.oneStroke ? 'outlined' : 'contained' }
						color="primary" 
						onClick={() => this.props.setOneStroke(false)} 
					>
						No
					</Button>
				</ListItem>
				<ListItem>
					<Typography variant='h6'>Show Template?</Typography>
				</ListItem>
				<ListItem>
					<Button 
						variant={ this.props.showTemplate ? 'contained' : 'outlined' }
						color="primary" 
						onClick={() => this.props.setShowTemplate(true)} 
					>
						Yes
					</Button>
					<Button 
						variant={ this.props.showTemplate ? 'outlined' : 'contained' }
						color="primary" 
						onClick={() => this.props.setShowTemplate(false)} 
					>
						No
					</Button>
				</ListItem>
			</List>
		)
	}
}

export default withStyles(styles)(Settings);
