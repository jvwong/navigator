export default function ( cytoscape ) {

  return cytoscape.stylesheet()

        // cluster node
        .selector('node')
        .css({
          'display': 'none',
          'width':  0,
          'height': 0,
        })

        .selector('node.visible')
        .css({
          'display': 'element',
          'border-width': 0,
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

        .selector("node[datasource='hallmark']")
        .css({
          'font-size': '36px',
          'font-weight': 'bold',
          'text-opacity': 0.9,
          'color': '#c0392b',
          'min-zoomed-font-size': '1px'
        })

        .selector('node.highlight')
        .css({
          'background-color': '#88CC88'
        })

        // generic edges
        .selector('edge')
        .css({
          'display': 'none',
          'width':  0
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
  'hallmark': '#c0392b',
  'humancyc': '#2c3e50',
  'inoh': '#8e44ad',
  'netpath': '#2980b9',
  'panther': '#27ae60',
  'pid': '#d35400',
  'reactome': '#f39c12',
  'smpdb': '#AEA8D3',
  'wikipathways': '#A2DED0',
  'kegg': '#16a085'
};
