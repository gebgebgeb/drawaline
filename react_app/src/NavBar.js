import React from 'react';
import {Link} from 'react-router-dom';

function NavBar() {
	return (
		<nav className="navbar navbar-dark bg-primary static-top">
			<Link className="navbar-brand" to="/">
				Tracing Trainer
			</Link>
		</nav>
	);
}

export default NavBar;
