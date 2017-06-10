import React from 'react';
import { initGraph } from './components/init.js';
import isEmpty from 'lodash/isEmpty';

// Graph
// Prop Dependencies ::
// - data
export class Graph extends React.Component {

  constructor(props) {
		super(props);
		this.state = {
			graphId: this.props.id || Math.floor(Math.random() * Math.pow(10, 8)) + 1,
      graphContainer: null,
      data: null,
			graphRendered: false,
			graphEmpty: false,
      width: '100vw',
			height: '85vh',
			layout: 'preset'
		};
	}

  componentDidMount() {
		const graphContainer = document.getElementById( this.state.graphId );
    this.setState({ graphContainer: graphContainer });
	}

  componentWillReceiveProps( nextProps ){
    if( !isEmpty( nextProps.data ) ){
      this.state.graphRendered = this.renderGraph( nextProps.data );
    }
  }

  // Graph rendering is not tracked by React
	renderGraph( data ) {
    const graphInstance = initGraph( this.state.graphContainer );
    graphInstance.remove('*');
    graphInstance.add( data );
    graphInstance.fit();
    return true;
  }

	render() {
    return (
      <div className='Graph'>
        <div id={ this.state.graphId }
          style={{width: this.state.width,height: this.state.height}}
        />
      </div>
    )
  }
}
//
