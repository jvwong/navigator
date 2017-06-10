import cytoscape from 'cytoscape';
import styleSheet from './EMStyleSheet.js';

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
var initGraph = function( container ){

  const graphInstance = cytoscape({
		container: container,
		style: styleSheet( cytoscape )
	});

	return graphInstance;
};

export { initGraph };
