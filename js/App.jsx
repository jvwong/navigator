import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/index.css';
import { Navigator } from './Navigator/Navigator.jsx';

const mountElement = document.getElementById('container');

// App
// Prop Dependencies ::
export class App extends React.Component {
	render() {
		return (
			<Navigator style={styles} />
		);
	}
}

ReactDOM.render(<App/>, mountElement);
