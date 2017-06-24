export default function ( cytoscape ) {

  return cytoscape.stylesheet()

        // cluster node
        .selector('node')
        .css({
          'display': 'none'
        })

        .selector('node.visible')
        .css({
          'display': 'element',
          'label': 'data(name)',
          'font-size': '16px',
          'text-opacity': 0.5,
          'width':  'data(size)',// scaling req'd
          'height': 'data(size)',
          'text-valign': 'center',
          'text-halign': 'right',
          'background-color': function( ele ){ return colors[ele.data('datasource')] },
          'opacity': 0.9,
          'min-zoomed-font-size': '14px'
        })

        .selector('node.highlight')
        .css({
          'background-color': '#88CC88'
        })

        // generic edges
        .selector('edge')
        .css({
          'display': 'none'
        })

        // generic edges
        .selector('edge.visible')
        .css({
          'display': 'element',
          'line-color': '#555',
          'color': '#555',
          'width':  'data(overlap)',
          'opacity': 0.3
        })

        .selector('edge.highlight')
        .css({
          'line-color': '#CD88AF',
          'opacity': 0.8
        })

        ;
}

export const colors = {
  'humancyc': '#2c3e50',
  'inoh': '#c0392b',
  'kegg': '#8e44ad',
  'netpath': '#2980b9',
  'panther': '#27ae60',
  'pid': '#d35400',
  'reactome': '#f39c12',
  'smpdb': '#AEA8D3',
  'wikipathways': '#A2DED0',
  'default': '#c0392b'
};
