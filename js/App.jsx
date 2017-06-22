import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/index.css';
import { Navigator } from './Navigator/Navigator.jsx';
import createHistory from 'history/createBrowserHistory';

const mountElement = document.getElementById('container');

/* history API */
const history = createHistory();




// App
// Prop Dependencies ::
export class App extends React.Component {

	render() {
		return (
			<Navigator history={ history } style={ styles } />
		);
	}
}

ReactDOM.render(<App/>, mountElement);
