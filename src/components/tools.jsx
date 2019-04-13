import React, {Component} from 'react';
import EventBus from '../eventBus';
import ToolStore, { POINTER, PEN, LINE, ELLIPSE, RECT } from '../toolStore';
import ColorPicker from './colorPicker.jsx';

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

	render() {
		const tools = this.state.tools.map((tool, i) => <div
			key={i}
			onClick={this.handleClick(i).bind(this)}
			className={tool.selected ? 'selected' : ''}
		><i className={tool.label + ' fa'}></i></div>)
		return (<div id="tools">
			{tools}
			<ColorPicker />
		</div>);
	}
}
