export default function ( cytoscape ) {

  return cytoscape.stylesheet()

        // cluster node
        .selector('node')
        .css({
          'content': 'data(name)',
          'text-opacity': 0.5,
          'width':  'data(size)',// scaling req'd
          'height': 'data(size)',
          'text-valign': 'center',
          'text-halign': 'right',
          'background-color': '#c0392b',
          'background-opacity': 0.9
        })

        // generic edges
        .selector('edge')
        .css({
          'line-color': '#555',
          'color': '#555',
          'width':  'data(overlap)'
        })
        ;
}
