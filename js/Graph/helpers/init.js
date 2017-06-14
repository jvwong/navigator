import cytoscape from 'cytoscape';

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
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 1,
    pixelRatio: 'auto'
	});

	return graphInstance;
};

export { initGraph };
