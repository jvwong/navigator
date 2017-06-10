import React from 'react';
import { Graph } from '../Graph/Graph.jsx';

// Navigator
// Prop Dependencies ::
export class Navigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {}
		};
	}

	componentDidMount() {
		fetch("reactome-data.json", {method: 'get', mode: 'no-cors'})
			.then(function(response) {
				return response.json()
			})
			.then(data => {
				this.setState({ data: data.elements });
      });
  }


	render() {
		return (
			<Graph data={ this.state.data } />
		);
	}
}
