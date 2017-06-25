import React from 'react';
import { initGraph } from './helpers/graph.js';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import memoize from 'fast-memoize';

// Graph
// Prop Dependencies ::
// - data: cytoscape graph elements
// - styleSheet: A cytoscape style sheet object
// - layout: A cytoscape layout
// - searchMap: A map of the URL params
// - toggleLoading: function to render or dismiss load spinner
export default class Graph extends React.Component {

  constructor(props) {
		super(props);
		this.state = {
			id: this.props.id,
      graphContainer: null,
      graphRendered: false,
			width: '100vw',
			height: '85vh'
		};
	}

  shouldComponentUpdate(nextProps, nextState){
		if( this.props.data && !this.state.graphRendered ){
			return true;
		}
		return false;
	}

  componentDidMount() {
    const graph = initGraph(
      document.getElementById( this.state.id ),
      this.props.styleSheet,
      this.props.layout
    );
    this.setState(( prevState, props ) => {
			return { graphInstance: graph }
		});
	}

  componentWillReceiveProps( nextProps ){
    if( !this.state.graphRendered && !isEmpty( nextProps.data ) ){
      this.state.graphRendered = this.renderGraph( nextProps.data );
    }
    else if( this.state.graphRendered && !isEqual( this.props.searchMap, nextProps.searchMap ) ){
      this.updateGraph( nextProps.searchMap.datasource );
    }
  }

  // Graph rendering is not tracked by React
	renderGraph( data ) {
    this.state.graphInstance.remove('*');
    this.state.graphInstance.add( data );
    this.state.graphInstance.fit();

    this.updateGraph( this.props.searchMap.datasource );

    return true;
  }

  // memoize these calls for efficiency?
	updateGraph( datasource ) {    
    const fetchCollection = memoize(( datasource ) => {

      const selectors = datasource.map(( source ) => { return "[datasource='" + source + "']" });
      const nodes = this.state.graphInstance.nodes( selectors.join() );
      const edges = nodes.connectedEdges();

      const nodeComplement = nodes.absoluteComplement();
      const edgeComplement = nodeComplement.connectedEdges();

      return {
        nodes: nodes,
        edges: edges,
        nodeComplement: nodeComplement,
        edgeComplement: edgeComplement
      }
    });

    this.state.graphInstance.batch( () => {
      if( !datasource.length ){
        return this.state.graphInstance.collection('*').removeClass('visible');
      }
      const collection = fetchCollection( datasource );
      collection.nodeComplement.removeClass('visible');
      collection.edgeComplement.removeClass('visible');
      collection.nodes.addClass('visible');
      collection.edges.addClass('visible');
    });
    this.state.graphInstance.fit();
  }

  componentWillUnmount(){
    this.state.graphInstance.destroy();
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
