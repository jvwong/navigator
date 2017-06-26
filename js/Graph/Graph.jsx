import React from 'react';
import { initGraph } from './helpers/graph.js';
import isEqual from 'lodash/isEqual';
import memoize from 'fast-memoize';

// Graph
// Prop Dependencies ::
// - data: cytoscape graph elements
// - styleSheet: A cytoscape style sheet object
// - layout: A cytoscape layout
// - searchMap: A map of the URL params
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

  // This method is not called for the initial render
  shouldComponentUpdate(nextProps, nextState){
		if( nextProps.index && nextProps.data && !this.state.graphRendered ){
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

  // React doesn't call componentWillReceiveProps with initial props during mounting.
  // It only calls this method if some of component's props may update.
  componentWillReceiveProps( nextProps ){
    if( nextProps.data && !this.state.graphRendered ){
      this.renderGraph( nextProps.data );
      if( nextProps.index && nextProps.searchMap ){
        return this.updateGraph( nextProps.searchMap.datasource, nextProps.index );
      }
    }
    if( this.state.graphRendered && nextProps.index && !isEqual( this.props.searchMap, nextProps.searchMap ) ){
      this.updateGraph( nextProps.searchMap.datasource, nextProps.index );
    }
  }

  // Graph rendering is not tracked by React
	renderGraph( data ) {
    this.state.graphInstance.remove('*');
    this.state.graphInstance.add( data );
    this.setState({ graphRendered: true });
  }

  // memoize these calls for efficiency?
	updateGraph( datasource, index ) {

    const getNodesBySource = memoize(( sourceId ) => {
      let nodes = this.state.graphInstance.collection();
      let node;
      index[sourceId].forEach( id => {
        node = this.state.graphInstance.getElementById( id );
        nodes = nodes.add(node);
      });
      return nodes;
    });


    this.state.graphInstance.batch( () => {
      let nodes = this.state.graphInstance.collection();
      datasource.forEach( sourceId => {
          nodes = nodes.add(getNodesBySource( sourceId ));
      });
      nodes.absoluteComplement().removeClass('visible');
      nodes.absoluteComplement().connectedEdges().removeClass('visible');
      nodes.addClass('visible');
      nodes.connectedEdges().addClass('visible');
    });
    this.state.graphInstance.fit();
    return true;
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
