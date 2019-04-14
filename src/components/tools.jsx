import React, {Component} from 'react';
import EventBus from '../eventBus';
import ToolStore, { POINTER, PEN, LINE, ELLIPSE, RECT } from '../toolStore';
import ColorPicker from './colorPicker.jsx';
import {signUserOut,
	redirectToSignIn} from 'blockstack';
import Whiteboard from './Whiteboard.jsx'

export default class Tools extends Component {
	constructor() {
		super();
		this.state = {
			tools: [
				{ id: POINTER, label: 'fa-mouse-pointer', type: 'cursor' },
				{ id: LINE, label: 'fa-slash', type: 'line', selected: true },
				{ id: RECT, label: 'fa-square', type: 'rect' },
				{ id: ELLIPSE, label: 'fa-circle-notch', type: 'ellipse' },
				{ id: PEN, label: 'fa-marker', type: 'pen' },
			]
		};
		ToolStore.subscribe(() => {
			const tools = this.state.tools.map(tool => ({ ...tool, selected: ToolStore.tool === tool.id }))
			this.setState({ tools })
		})
	}
	handleClick(index) {
		return function () {
			EventBus.emit(EventBus.TOOL_CHANGE, this.state.tools[index].id);
		}
	}
	//signs the user out
	handleSignOut(e){
		e.preventDefault();
		signUserOut(window.location.origin);
	}
	//loads images from file
	load(e){
		e.preventDefault();
		const r_options = {decrypt: true};
		getFile('whiteboard.json', r_options)
			.then((res) => {
				var whiteboard = JSON.parse(res || '[]')
				console.log(whiteboard);
			})
			.catch(e => console.log(e.stack))

	}
	//this saves the image currently on the whiteboard
	save(e){
		e.preventDefault();
		const w_options = {encrypt: true};
		putFile('whiteboard.json', JSON.stringify(this.state.data), w_options)
			.then(() => {
				console.log("written successfully");
			})
			.catch(e => console.error(e.stack));

	}

	render() {
		const tools = this.state.tools.map((tool, i) => <div
			key={i}
			onClick={this.handleClick(i).bind(this)}
			className={tool.selected ? 'selected' : ''}
		><i className={tool.label + ' fa'}></i></div>)
		return (<div id="tools">
			{tools}
			<ColorPicker />
			<button onClick = {this.save.bind(this)}>
				save
			</button>
			<button onClick = {this.load.bind(this)}>
				load
			</button>
			<button onClick = {this.handleSignOut.bind(this)}>
				exit
			</button>
		</div>);
	}
}
