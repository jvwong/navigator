import cytoscape from 'cytoscape';
import simpleStyleSheet from './simpleStyleSheet.js';

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
var initGraph = function( container ){

  const graphInstance = cytoscape({
		container: container,
		style: simpleStyleSheet( cytoscape )
	});

	return graphInstance;
};

export { initGraph };
