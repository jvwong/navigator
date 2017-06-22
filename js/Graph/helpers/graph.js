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
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 1,
    pixelRatio: 'auto'
	});

  graphInstance.on('mouseover', 'node', function (evt) {
    const node = evt.target;
    const neighborhood = node.neighborhood();

    node.style({
      'background-color': '#2980b9',
      'opacity': 1
    });
    neighborhood.nodes().style({
      'background-color': '#2980b9',
      'opacity': 1,
      'z-compound-depth': 'top'
    });
    neighborhood.edges().style({
      'line-color': '#2ecc71',
      'opacity': 1
    });
  });

  graphInstance.on('mouseout', 'node', function (evt) {
    const node = evt.target;
    if (node.data('class') === 'compartment') {
      return;
    }
    const neighborhood = node.neighborhood();

    node.style({
      'background-color': '#c0392b'
    });
    neighborhood.nodes().style({
      'background-color': '#c0392b',
      'z-compound-depth': 'auto'
    });
    neighborhood.edges().style({
      'line-color': '#555',
      'opacity': 0.3
    });
  });

  graphInstance.on('tap', 'node', function (evt) {
    const node = evt.target;
    console.log(graphInstance.zoom());
    console.log(node.renderedPosition());
  });



	return graphInstance;
};

export { initGraph };
