import React, { Component } from 'react';

import NavBar from './NavBar'
import MainGrid from './MainGrid'


class App extends Component {
  render() {
    return (
			<div>
				<NavBar />
				<MainGrid />
      </div>
    );
  }
}

export default App;
