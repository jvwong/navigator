import React from 'react';
import EMStyleSheet from './EMStyleSheet.js';
import Graph from '../Graph.jsx';
// EMGraph
// Prop Dependencies ::
// - data

export class EMGraph extends React.Component {

  constructor(props) {
		super(props);
		this.state = {
			id: Math.floor(Math.random() * Math.pow(10, 8)) + 1,
      layout: 'preset'
		};
	}

	render() {
    return (
      <Graph
      { ...this.props }
      searchMap={ this.props.searchMap }
      id={ this.state.id }
			data={ this.props.data }
      index={ this.props.index }
      styleSheet={ EMStyleSheet }
      layout={ this.state.layout } />
    )
  }
}
//
