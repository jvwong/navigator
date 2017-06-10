import cytoscape from 'cytoscape';
import simpleStyleSheet from './simpleStyleSheet.js';

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
export const initGraph = ( container ) => {

  const graphInstance = cytoscape({
		container: container,
		style: simpleStyleSheet( cytoscape )
	});

	return graphInstance;
};
