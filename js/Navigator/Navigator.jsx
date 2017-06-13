import React from 'react';
import {
	SplitButton,
	MenuItem
} from 'react-bootstrap';
import { EMGraph } from '../Graph/components/EMGraph.jsx';
import { Spinner } from '../components/Spinner.jsx';

// Navigator
// Prop Dependencies ::

export class Navigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			loading: true,
			currentSource : 'inoh',
			sources: {
				all: {
					displayName: "All",
					data: "PathwayCommons9.All.hgnc.cyjs"
				},
				humancyc: {
					displayName: "HumanCyc",
					data: "PathwayCommons9.All.hgnc.cyjs"
				},
				inoh: {
					displayName: "Integrating Network Objects with Hierarchies",
					data: "PathwayCommons9.inoh.hgnc.cyjs"
				},
				kegg: {
					displayName: "KEGG",
					data: "PathwayCommons9.kegg.hgnc.cyjs"
				},
				netpath: {
					displayName: "NetPath",
					data: "PathwayCommons9.netpath.hgnc.cyjs"
				},
				panther: {
					displayName: "PANTHER Pathway",
					data: "PathwayCommons9.panther.hgnc.cyjs"
				},
				pid: {
					displayName: "NCI Pathway Interaction Database",
					data: "PathwayCommons9.pid.hgnc.cyjs"
				},
				reactome: {
					displayName: "Reactome",
					data: "PathwayCommons9.reactome.hgnc.cyjs"
				},
				smpdb: {
					displayName: "Small Molecular Pathway Database",
					data: "PathwayCommons9.smpdb.hgnc.cyjs"
				},
				wp: {
					displayName: "WikiPathways",
					data: "PathwayCommons9.wp.hgnc.cyjs"
				}
			}
		};

		// This binding is necessary to make `this` work in the callback
    this.renderSourceMenu = this.renderSourceMenu.bind(this);
		this.handleSelect = this.handleSelect.bind(this);		
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
		this.updateSource( this.state.currentSource );
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
		if( key === this.state.currentSource ) return;
		this.setState(( prevState, props ) => {
			return { loading: true };
		}, this.updateSource( key ) );
	}

	render() {
		return (
			<div className="Navigator">
				<Spinner full hidden={!this.state.loading} />
				<SplitButton
					bsStyle='default'
					title={ this.state.sources[this.state.currentSource].displayName }
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
