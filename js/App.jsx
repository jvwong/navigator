import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/index.css';

const mountElement = document.getElementById('container');

export class App extends React.Component {
	render() {
		return (
			<div>
				<h1>Hello Jw!!</h1>
			</div>
		);
	}
}

ReactDOM.render(<App/>, mountElement);

// Load the full build.
// import styles from '../styles/index.css';
//
// function component () {
//   var element = document.getElementById('container');
//
//   /* lodash is required for the next line to work */
//   element.innerHTML = 'Heya';
//
//   return element;
// }
//
// document.body.appendChild(component());
