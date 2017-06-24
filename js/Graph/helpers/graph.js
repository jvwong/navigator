import cytoscape from 'cytoscape';
import cyqtip from 'cytoscape-qtip';

// register extensions
cyqtip( cytoscape );

// set the sbgn style sheet
// bind interaction events (mouse hovering, collapsing)
var initGraph = function( container, styleSheet, layout ){

  const graphInstance = cytoscape({
		container: container,
		style: styleSheet( cytoscape ),
    layout: {
      name: 'preset'
    },
    // interaction options:
    minZoom: 0.1,
    maxZoom: 10,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: false,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,

    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: true,
    hideLabelsOnViewport: true,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 1,
    pixelRatio: 1
	});

  graphInstance.on('mouseover', 'node', function (evt) {
    const node = evt.target;
    const neighborhood = node.neighborhood().add(node);

    neighborhood.nodes().addClass('highlight');
    neighborhood.edges().addClass('highlight');
  });

  graphInstance.on('mouseout', 'node', function (evt) {
    const node = evt.target;
    const neighborhood = node.neighborhood().add(node);

    neighborhood.nodes().removeClass('highlight')
    neighborhood.edges().removeClass('highlight');
  });

  graphInstance.on('mouseover', 'edge', function (evt) {
    const edge = evt.target;

    edge.addClass('highlight');
    edge.connectedNodes().addClass('highlight');
  });

  graphInstance.on('mouseout', 'edge', function (evt) {
    const edge = evt.target;
    edge.removeClass('highlight');
    edge.connectedNodes().removeClass('highlight');
  });


	return graphInstance;
};

export { initGraph };
