import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import styles from './styles'
import { withStyles } from '@material-ui/core/styles';


function NavBar(props) {
	const {classes} = props;
  return (
		<AppBar position="absolute" color="default" className={classes.appBar}>
			<Toolbar>
				<Typography variant="h6" color="inherit" noWrap>
					Tracing Trainer
				</Typography>
			</Toolbar>
		</AppBar>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
