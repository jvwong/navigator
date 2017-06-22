import React from 'react';
import { initGraph } from './helpers/graph.js';
import isEmpty from 'lodash/isEmpty';

// Graph
// Prop Dependencies ::
// - data: cytoscape graph elements
// - styleSheet: A cytoscape style sheet object
// - layout: A cytoscape layout
// - zoom
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

    // A node’s position refers to the centre point of its body.
    // There is an important distinction to make for position: A position may be a model position or a rendered position.
    // A model position — as its name suggests — is the position stored in the model for an element. An element’s model position remains constant, despite changes to zoom and pan. Numeric style property values are specified in model co-ordinates, e.g. an node with width 20px will be 20 pixels wide at zoom 1.
    // A rendered position is an on-screen location relative to the viewport. For example, a rendered position of { x: 100, y: 100 } specifies a point 100 pixels to the right and 100 pixels down from the top-left corner of the viewport. The model position and rendered position are the same at zoom 1 and pan (0, 0).
    // An element’s rendered position naturally changes as zoom and pan changes, because the element’s on-screen position in the viewport changes as zooming and panning are applied. Panning is always measured in rendered coordinates.
    // In this documentation, “position” refers to model position unless otherwise stated.
    // this.state.graphInstance.viewport({
    //    zoom: 1.2856455611923199,
    //    pan:  {x: 100.43111361232786, y: 419.0732111547127}
    // });
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
