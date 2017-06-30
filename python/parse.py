import json
import os
import csv
import requests
import re
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RESULTS_DIR = os.path.join(DATA_DIR, 'results')
CYREST_NETWORKS_URL = 'http://localhost:1234/v1/networks/'

def do_em( gmtFile, analysisType='generic', similaritycutoff = '0.375', coeffecients = 'COMBINED' ):
    CYREST_EM_URL = 'http://localhost:1234/v1/commands/enrichmentmap/build?analysisType={analysisType}&gmtFile={gmtFile}&similaritycutoff={similaritycutoff}&coeffecients={coeffecients}'

    if not os.path.exists(gmtFile):
        raise Exception('The input file doesn\'t exist')

    url = CYREST_EM_URL.format(
        analysisType = analysisType,
        gmtFile = gmtFile,
        similaritycutoff = similaritycutoff,
        coeffecients = coeffecients)
    response = requests.get(url)
    return response

def get_em_json():
    networkIds = requests.get(CYREST_NETWORKS_URL).json()
    output = []
    for networkId in networkIds:
        networkURL = CYREST_NETWORKS_URL + str(networkId) + '/'
        output.append(requests.get(networkURL).json())
    return output

def format_hallmarks( inpath, outpath ):
    with open(inpath, 'r') as gmt_infile, open(outpath, 'w') as gmt_outfile:
        reader = csv.reader(gmt_infile, delimiter='\t')
        writer = csv.writer(gmt_outfile, delimiter='\t')
        for row in reader:
            outrow = []
            for idx, val in enumerate( row ):
                if idx == 1:
                    outrow.append( 'name: {name}; datasource: hallmark; organism: 9606; idtype: hgnc symbol; uri: {uri}'.format(name=row[0], uri=row[1]) )
                else:
                    outrow.append( val )
            writer.writerow( outrow )

def format_pc( inpath, outpath ):
    with open(inpath, 'r') as gmt_infile, open(outpath, 'w') as gmt_outfile:
        reader = csv.reader(gmt_infile, delimiter='\t')
        writer = csv.writer(gmt_outfile, delimiter='\t')
        for row in reader:
            outrow = []
            for idx, val in enumerate( row ):
                if idx == 1:
                    outrow.append( row[idx] + '; uri: {uri}'.format(uri=row[0]) )
                else:
                    outrow.append( val )
            writer.writerow( outrow )

def parse_description( data ):
    fields = ['uri', 'idtype', 'organism', 'datasource', 'name']
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
    pc_view_url = 'http://beta.pathwaycommons.org/pathways/#/view?uri='
    node_schema = {
        'data': {
            'id': None,
            'uri': None,
            'name': None,
            'datasource': None,
            'size': None
            # 'genes': None # turn off for now
        },
        'position': None
    }
    description = parse_description( node['data']['EM1_GS_DESCR'] )
    node_schema['data']['id'] = node['data']['id']
    node_schema['data']['uri'] = pc_view_url + description['uri']
    node_schema['data']['name'] = description['name']
    node_schema['data']['datasource'] = description['datasource']
    node_schema['data']['size'] = node['data']['EM1_gs_size']
    # node_schema['data']['genes'] = node['data']['EM1_Genes']
    node_schema['position'] = node['position']

    if description['datasource'] == 'hallmark':
        node_schema['data']['uri'] = description['uri']

    return node_schema

def make_edge( edge ):
    edge_schema = {
        'data': {
            'id': None,
            'source': None,
            'target': None,
            'overlap': None
            # 'genes': None # turn off for now
        }
    }
    edge_schema['data']['id'] = edge['data']['id']
    edge_schema['data']['source'] = edge['data']['source']
    edge_schema['data']['target'] = edge['data']['target']
    edge_schema['data']['overlap'] = edge['data']['EM1_Overlap_size']
    # edge_schema['data']['genes'] = edge['data']['EM1_Overlap_genes']

    return edge_schema

GMT_HALLMARKS = os.path.join(DATA_DIR, 'h.all.v6.0.symbols.gmt')
GMT_HALLMARKS_DESCRIPTION = os.path.join(DATA_DIR, 'h.all.v6.0.symbols.description.gmt')
GMT_PC = os.path.join(DATA_DIR, 'PathwayCommons9.All.hgnc.gmt')
GMT_PC_DESCRIPTION = os.path.join(DATA_DIR, 'PathwayCommons9.All.hgnc.description.gmt')
GMT_COMBINED = os.path.join(DATA_DIR, 'PC9.hallmarks.gmt')
JSON_EM = os.path.join(DATA_DIR, 'PC9.hallmarks.cyjs')

# ## ******************* START: format_hallmarks **************************** ##
# format_hallmarks(GMT_HALLMARKS, GMT_HALLMARKS_DESCRIPTION)
# format_pc(GMT_PC, GMT_PC_DESCRIPTION)
# ## ******************* END: format_hallmarks **************************** ##
#
# ## Concatenate
# ftargets = [GMT_PC_DESCRIPTION, GMT_HALLMARKS_DESCRIPTION]
# with open(GMT_COMBINED, 'w') as outfile:
#     for fname in ftargets:
#         with open(fname) as infile:
#             for line in infile:
#                 outfile.write(line)
#
# ## ******************* START: do_em **************************** ##
# # problem is that cyrest doesn't return 'position' field. Do manual.
# response = do_em(GMT_COMBINED)
# ## ******************* END: do_em **************************** ##

## ******************* START: format cyjson **************************** ##
for root, dirs, files in os.walk(DATA_DIR, topdown=False):
    for name in files:
        if os.path.splitext(name)[1] != '.cyjs':
            continue

        fsource = os.path.join(root, name)
        ftarget = os.path.join(RESULTS_DIR, os.path.splitext(name)[0] + '.json')
        findex = os.path.join(RESULTS_DIR, os.path.splitext(name)[0] + '.index.json')

        with open(fsource, 'r', encoding='utf-8') as infile, open(ftarget, 'w') as outfile, open(findex, 'w') as indexfile:
            js = json.load(infile)
            outdata = {
                'elements': {
                    'nodes': [],
                    'edges': []
                }
            }
            index = {}
            nodes = []
            edges = []
            for node in js['elements']['nodes']:
                new_node = make_node( node )
                outdata['elements']['nodes'].append(new_node)
                if( new_node['data']['datasource'] in index ):
                    index[new_node['data']['datasource']].append(new_node['data']['id'])
                else:
                    index[new_node['data']['datasource']] = [new_node['data']['id']]

            for edge in js['elements']['edges']:
                new_edge = make_edge( edge )
                outdata['elements']['edges'].append(new_edge)

            json.dump(outdata, outfile, ensure_ascii=False)
            json.dump(index, indexfile, ensure_ascii=False)
## ******************* END: format cyjson **************************** ##
