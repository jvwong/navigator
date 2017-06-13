export default function ( cytoscape ) {

  return cytoscape.stylesheet()

        // cluster node
        .selector('node[NumChildren >= 0]')
        .css({
          'width':  'data(NumChildren)',// scaling req'd
          'height': 'data(NumChildren)'
        })

        // single node
        .selector('node[EM1_gs_size_dataset1 >= 0]')
        .css({
          'width':  'data(EM1_gs_size_dataset1)', // scaling req'd
          'height': 'data(EM1_gs_size_dataset1)'
        })

        // generic node
        .selector('node')
        .css({
          // 'content': 'data(name)',
          'text-opacity': 0.5,
          'text-valign': 'center',
          'text-halign': 'right',
          'background-color': '#c0392b',
          'background-opacity': 0.9
        })

        // shared edge
        .selector('edge[EM1_Overlap_size >= 0]')
        .css({
          'width': 'data(EM1_Overlap_size)', //should scale appropriately
        })

        // generic edges
        .selector('edge')
        .css({
          'line-color': '#555',
          'color': '#555'
        })
        ;
}
