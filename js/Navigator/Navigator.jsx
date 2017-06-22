import React from 'react';
import {
	SplitButton,
	MenuItem
} from 'react-bootstrap';
import { EMGraph } from '../Graph/components/EMGraph.jsx';
import { Spinner } from '../components/Spinner.jsx';
import queryString from 'query-string';
// import cloneDeep from 'lodash/cloneDeep';

// Navigator
// Prop Dependencies ::
// - history
export class Navigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			loading: true,
			searchMap: {
				//This is not robust to garbage. need validate method
				datasource: this.makeSearchMap().datasource || 'smpdb'
			},
			searchSchema: {
				datasource: true
			},
			sources: {
				all: {
					displayName: "All",
					data: "PathwayCommons9.all.hgnc.json"
				},
				humancyc: {
					displayName: "HumanCyc",
					data: "PathwayCommons9.humancyc.hgnc.json"
				},
				inoh: {
					displayName: "Integrating Network Objects with Hierarchies",
					data: "PathwayCommons9.inoh.hgnc.json"
				},
				kegg: {
					displayName: "KEGG",
					data: "PathwayCommons9.kegg.hgnc.json"
				},
				netpath: {
					displayName: "NetPath",
					data: "PathwayCommons9.netpath.hgnc.json"
				},
				panther: {
					displayName: "PANTHER Pathway",
					data: "PathwayCommons9.panther.hgnc.json"
				},
				pid: {
					displayName: "NCI Pathway Interaction Database",
					data: "PathwayCommons9.pid.hgnc.json"
				},
				reactome: {
					displayName: "Reactome",
					data: "PathwayCommons9.reactome.hgnc.json"
				},
				smpdb: {
					displayName: "Small Molecular Pathway Database",
					data: "PathwayCommons9.smpdb.hgnc.json"
				},
				wp: {
					displayName: "WikiPathways",
					data: "PathwayCommons9.wp.hgnc.json"
				}
			}
		};


		// This binding is necessary to make `this` work in the callback
    this.renderSourceMenu = this.renderSourceMenu.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		// Listen for any changes to the current location (browser, history api).
		this.props.history.listen( this.handleSearchChange );
	}

	//this needs to be robust to garbage in
	makeSearchMap(){
		return queryString.parse( this.props.history.location.search );
	}

	getSource( key ) {
		const url = 'data/' + this.state.sources[key].data;
		return fetch(url, { method: 'get', mode: 'no-cors' })
			.then(function(response) {
				return response.json()
			})
			;
	}

	updateSource( key ){
		this.getSource( key )
			.then( data => {
				this.setState(( prevState, props ) => {
					return {
						data: data.elements,
						currentSource: key,
						loading: false
					}
				});
			});
	}

	componentDidMount() {
		this.handleSelect( this.state.searchMap.datasource );
  }

	renderSourceMenu(key, i) {
		return (
			<MenuItem
				eventKey={ key }
				key={ i }>{ this.state.sources[key].displayName }
			</MenuItem>
		);
	}

	handleSelect( key ) {
		this.props.history.push( '?' + queryString.stringify({ datasource: key}) );
	}

	handleSearchChange( location, action ) {
		const parsed = queryString.parse( location.search );
		// TODO. Not robust
			//1. validate against searchSchema - dont' allow any garbage
			//2. try to change validate against searchSchema - dont' allow any garbage
			// - copy previous parameters

		this.setState(( prevState, props ) => {
			return { loading: true };
		}, this.updateSource( parsed.datasource ) );
	}

	render() {
		return (
			<div className="Navigator">
				<Spinner full hidden={!this.state.loading} />
				<SplitButton
					bsStyle='default'
					title={ this.state.sources[this.state.searchMap.datasource].displayName }
					id="split-button-sources"
					onSelect={ this.handleSelect }>
					{ Object.keys(this.state.sources).map(this.renderSourceMenu) }
				</SplitButton>
				<EMGraph
				data={ this.state.data }/>
			</div>
		);
	}
}
