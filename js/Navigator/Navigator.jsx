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
