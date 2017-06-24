import React from 'react';
import {
	Button
} from 'react-bootstrap';
import Select from 'react-select';
import { EMGraph } from '../Graph/components/EMGraph.jsx';
import { Spinner } from '../components/Spinner.jsx';
import queryString from 'query-string';
import concat from 'lodash/concat';
import isEqual from 'lodash/isEqual';

// Navigator
// Prop Dependencies ::
// - history
export class Navigator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataUrl: 'data/PathwayCommons9.all.hgnc.json',
			data: null,
			loading: true,
			selected: [],
			searchMap: this.pullSearchMap(),
			searchSchema: {
				datasource: true
			},
			options: [
				{
					label: 'HumanCyc',
					value: 'humancyc'
				},
				{
					label: 'Integrating Network Objects with Hierarchies',
					value: 'inoh'
				},
				{
					label: 'KEGG',
					value: 'kegg'
				},
				{
					label: 'NetPath',
					value: 'netpath'
				},
				{
					label: 'PANTHER Pathway',
					value: 'panther'
				},
				{
					label: 'NCI Pathway Interaction Database',
					value: 'pid'
				},
				{
					label: 'Reactome',
					value: 'reactome'
				},
				{
					label: 'Small Molecular Pathway Database',
					value: 'smpdb'
				},
				{
					label: 'WikiPathways',
					value: 'wikipathways'
				}
			]
		};


		// This binding is necessary to make `this` work in the callback
    this.renderSourceMenu = this.renderSourceMenu.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		// Listen for any changes to the current location (browser, history api).
		this.props.history.listen( this.handleSearchChange );
	}

	pullSearchMap(){
		const parsed = queryString.parse( this.props.history.location.search );
		//this needs to be robust to garbage in
		if( parsed.datasource ){
			parsed.datasource = concat([], parsed.datasource).sort();
		} else {
			parsed.datasource = [];
		}
		return parsed;
	}

	pushSearchMap( searchMap ){
		//this needs to be robust to garbage in
		const outgoing = {};
		for ( const key in searchMap ) {
			if( key === 'datasource'  ){
				outgoing[key] = searchMap[key].map( source => source.value );
			} else {
				outgoing[key] = searchMap[key];
			}
		}
		this.props.history.push( '?' + queryString.stringify( outgoing ) );
	}

	fetchData( url ) {
		return fetch( url, { method: 'get', mode: 'no-cors' })
			.then( response => {
				return response.json()
			});
	}

	componentDidMount() {
		this.fetchData( this.state.dataUrl )
			.then( data => {
				const selected = this.state.options.filter( option => {
					return this.pullSearchMap().datasource.some( source =>  {
						return option.value === source;
					});
				});
				this.setState(( prevState, props ) => {
						return {
							data: data.elements,
							loading: false,
							selected: selected
						}
				}, null);
			});
  }

	renderSourceMenu(key, i) {
		return (
			<Checkbox
				key={i}
				checked={ this.state.checkboxChecked }
				onChange={ e => this.handleSelect(e.target.checked) }
				inline>
					{ this.state.sources[key].displayName }
				</Checkbox>
		);
	}

	shouldComponentUpdate(nextProps, nextState){
		if( !isEqual( this.state.searchMap.datasource, nextState.searchMap.datasource )  ){
			return true;
		}
		if( !this.state.data && nextState.data ){
			return true;
		}
		if( !isEqual( this.state.selected, nextState.selected ) ){
			return true;
		}
		return false;
	}

	handleSelect( value ) {
		this.setState({ selected: value });
	}

	handleSubmit( event ) {
		event.preventDefault();
		const searchMap = {
			datasource: this.state.selected
		};
		this.pushSearchMap( searchMap );
	}

	handleSearchChange( location, action ) {
		this.setState(( prevState, props ) => {
			return {
				searchMap: this.pullSearchMap()
			}
		});
	}

	render() {
		return (
			<div className="Navigator">
				<Spinner full hidden={!this.state.loading} />
				<div className="source-selection">
					<form onSubmit={ this.handleSubmit }>
						<Select
							multi
							name="form-field-name"
							value={ this.state.selected }
							options={ this.state.options }
							onChange={ this.handleSelect }
							/>
							<Button type="submit">Submit</Button>
					</form>
				</div>
				<EMGraph
				searchMap={ this.state.searchMap }
				data={ this.state.data }/>
			</div>
		);
	}
}
