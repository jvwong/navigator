import React from 'react';
import { initGraph } from './helpers/graph.js';
import isEqual from 'lodash/isEqual';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
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
        return this.updateGraph( nextProps.index, nextProps.searchMap.datasource, null );
      }
    }
    if( this.state.graphRendered && nextProps.index && !isEqual( this.props.searchMap, nextProps.searchMap ) ){
      this.updateGraph( nextProps.index, nextProps.searchMap.datasource, this.props.searchMap.datasource );
    }
  }

  // Graph rendering is not tracked by React
	renderGraph( data ) {
    this.state.graphInstance.remove('*');
    this.state.graphInstance.add( data );
    this.setState({ graphRendered: true });
  }

	updateGraph( index, nextDatasource, datasource ) {

    const getNodesBySource = memoize(( sourceId ) => {
      let nodes = this.state.graphInstance.collection();
      let node;
      index[sourceId].forEach( id => {
        node = this.state.graphInstance.getElementById( id );
        nodes = nodes.add(node);
      });
      return nodes;
    });

    // For efficiency, do the work on source labels
    // get intersection
    const datasourceIntersect = intersection(nextDatasource, datasource);

    // turn ON datasource - intersection
    const datasourceON = difference(nextDatasource, datasourceIntersect);

    // turn OFF current - difference
    const datasourceOFF = difference(datasource, datasourceIntersect);


    this.state.graphInstance.batch( () => {

      // get desired nodes (graph or memoized/cache)
      let onNodes = this.state.graphInstance.collection();
      let offNodes = this.state.graphInstance.collection();

      // collection of nodes to turn ON
      datasourceON.forEach( sourceId => {
          onNodes = onNodes.add(getNodesBySource( sourceId ));
      });
      // collection of nodes to turn OFF
      datasourceOFF.forEach( sourceId => {
          offNodes = offNodes.add(getNodesBySource( sourceId ));
      });

      onNodes.addClass('visible');
      onNodes.connectedEdges().addClass('visible');

      // turn OFF visible.difference
      offNodes.removeClass('visible');
      offNodes.connectedEdges().removeClass('visible');
    });
    if( !datasource ) this.state.graphInstance.fit();
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
