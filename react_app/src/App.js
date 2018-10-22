import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import MainGrid from './MainGrid'
import styles from './styles'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'light',
  },
});

class App extends Component {
  render() {
    return (
			<CssBaseline>
				<MuiThemeProvider theme={theme}>
					<MainGrid/>
				</MuiThemeProvider>
			</CssBaseline>
    );
  }
}

export default withStyles(styles)(App);
