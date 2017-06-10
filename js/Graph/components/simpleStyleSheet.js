var simpleStyleSheet = function ( cytoscape ) {

  return cytoscape.stylesheet()
        // general node style
        .selector('node')
        .css({
          'content': 'data(name)',
          'text-opacity': 0.5,
          'text-valign': 'center',
          'text-halign': 'right',
          'background-color': '#11479e',
          'background-opacity': 0.5
        })

        // edge styling
        .selector('edge')
        .css({
          'line-color': '#555',
          'width': 1.5,
          'color': '#555'
        })
        ;
};

module.exports = simpleStyleSheet;
