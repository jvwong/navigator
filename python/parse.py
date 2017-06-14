import json

def parse_description( data ):
    fields = ['idtype', 'organism', 'datasource', 'name']
    parsed = {}
    remainder = None

    for idx, field in enumerate(fields):
        delimiter = field + ':'
        if idx == 0:
            delimited = data.split(delimiter)
        else:
            delimited = remainder.split(delimiter)
        remainder = delimited[0]
        parsed[field] = delimited[1].strip().rstrip(';')
    return parsed

def make_node( node ):
    node_schema = {
        'data': {
            'id': None,
            'name': None,
            'datasource': None,
            'size': None,
            'genes': None
        },
        'position': None
    }
    description = parse_description( node['data']['EM1_GS_DESCR'] )
    node_schema['data']['id'] = node['data']['id']
    node_schema['data']['name'] = description['name']
    node_schema['data']['datasource'] = description['datasource']
    node_schema['data']['size'] = node['data']['EM1_gs_size_dataset1']
    node_schema['data']['genes'] = node['data']['EM1_Genes']
    node_schema['position'] = node['position']

    return node_schema

def make_edge( edge ):
    edge_schema = {
        'data': {
            'id': None,
            'source': None,
            'target': None,
            'overlap': None,
            'genes': None
        }
    }
    edge_schema['data']['id'] = edge['data']['id']
    edge_schema['data']['source'] = edge['data']['source']
    edge_schema['data']['target'] = edge['data']['target']
    edge_schema['data']['overlap'] = edge['data']['EM1_Overlap_size']
    edge_schema['data']['genes'] = edge['data']['EM1_Overlap_genes']

    return edge_schema

import os
if not os.path.exists('./results'):
    os.makedirs('./results')

for root, dirs, files in os.walk("./data", topdown=False):
    for name in files:
        fsource = os.path.join(root, name)
        ftarget = './results/' + os.path.splitext(name)[0] + '.json'

        with open(fsource, 'r', encoding='utf-8') as infile, open(ftarget, 'w') as outfile:
            js = json.load(infile)
            outdata = {
                'elements': {
                    'nodes': [],
                    'edges': []
                }
            }
            nodes = []
            edges = []
            for node in js['elements']['nodes']:
                new_node = make_node( node )
                outdata['elements']['nodes'].append(new_node)

            for edge in js['elements']['edges']:
                new_edge = make_edge( edge )
                outdata['elements']['edges'].append(new_edge)

            json.dump(outdata, outfile, ensure_ascii=False)
