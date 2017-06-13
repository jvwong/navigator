import React from 'react';
import { initGraph } from './helpers/init.js';
import isEmpty from 'lodash/isEmpty';

// Graph
// Prop Dependencies ::
// - data: cytoscape graph elements
// - styleSheet: A cytoscape style sheet object
// - layout: A cytoscape layout
export default class Graph extends React.Component {

  constructor(props) {
		super(props);
		this.state = {
			id: this.props.id,
      graphContainer: null,
      data: null,
			graphRendered: false,
			graphEmpty: false,
      width: '100vw',
			height: '85vh'
		};
	}

  componentDidMount() {
    const graph = initGraph(
      document.getElementById( this.state.id ),
      this.props.styleSheet,
      this.props.layout
    );
    this.setState({ graphInstance: graph })
	}

  componentWillReceiveProps( nextProps ){
    if( !isEmpty( nextProps.data ) ){
      this.state.graphRendered = this.renderGraph( nextProps.data );
    }
  }

  // Graph rendering is not tracked by React
	renderGraph( data ) {
    this.state.graphInstance.remove('*');
    this.state.graphInstance.add( data );
    this.state.graphInstance.fit();
    return true;
  }

	render() {
    return (
      <div className='Graph'>
        <div id={ this.state.id }
          style={{width: this.state.width,height: this.state.height}}
        />
      </div>
    )
  }
}
//
