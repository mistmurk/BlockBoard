import React, {Component} from 'react';
import EventBus from '../eventBus';
import Store from '../store';
import Selection from './selection.jsx'
import { getShapeRect } from '../utils'
import {
  isSignInPending,
  loadUserData,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';

export default class WhiteBoard extends React.Component {
	constructor() {
		super();

		Store.subscribe(() => {
			this.setState({ data: Store.data });
		});
		this.state = { data: Store.data };
		this.scale = 1.1;
		this.dx = 0;
		this.dy = 0;
		this.pressed = false;

		EventBus.on(EventBus.SAVE, this.save.bind(this));
		EventBus.on(EventBus.LOAD, this.load.bind(this));
	}

	componentDidMount() {
		document.addEventListener("mousedown", this.mouseDown.bind(this));
		document.addEventListener("mousemove", this.mouseMove.bind(this));
		document.addEventListener("mouseup", this.mouseUp.bind(this));
		document.addEventListener("keydown", this.keyDown.bind(this));
		window.addEventListener("resize", this.onResize.bind(this));

		this.onResize();
		this.setState({ data: Store.data });
	};

	save() {
		let stringified = JSON.stringify(this.state.data, (name, val) => {
			if(typeof val === 'function') {
				return val.toString().substring(9, val.toString().indexOf('('));
			}
			return val;
		});
		const w_options = {encrypt: true};
		putFile('whiteboard.json', stringified, w_options)
			.then(() => {
				console.log("written successfully");
			})
			.catch(e => console.error(e.stack));
	}

	load() {
		const r_options = {decrypt: true};
		getFile('whiteboard.json', r_options)
			.then((res) => {
				Store.loadJson(res);
			})
			.catch(e => console.log(e.stack));
	}


	onResize() {
		this.rect = this._svg.getBoundingClientRect();
	}

	mousePos(e) {
		;
		let round = 2
		return {
			x: round * Math.round(e.clientX / round) - this.rect.left,
			y: round * Math.round(e.clientY / round) - this.rect.top
		};
	}

	_insideRect(rect, point) {
		return point.x > rect.left && point.x < rect.right
			&& point.y > rect.top && point.y < rect.bottom;
	}

	mouseDown(e) {
		if (this._insideRect(this.rect, { x: e.clientX, y: e.clientY })) {
			this.pressed = true;
			EventBus.emit(EventBus.START_PATH, this.mousePos(e))
		}
	}

	mouseMove(e) {
		if (this.pressed) {
			EventBus.emit(EventBus.MOVE_PATH, this.mousePos(e))
		}
	}

	mouseUp(e) {
		this.pressed = false;
		EventBus.emit(EventBus.END_PATH, this.mousePos(e))
	}

	keyDown(e) {
		switch (e.keyCode) {
			case 27: //escape
				EventBus.emit(EventBus.UNDO)
				break;
			case 83: //s
				this.save();
				break;
			case 76: //l
				this.load();
				break;
		}
	}
	onMove(shape){
		return move=>{
			EventBus.emit(EventBus.MOVE, {shape, move})
		}
	}


	render() {
		const data = this.state.data
		let selection = null
		const shapes = data.shapes.map((shape, i) => {
			if (shape.selected) {
				selection = <Selection rect={getShapeRect(shape)} move={this.onMove(shape)}/>
			}
			return <shape.class key={i} path={shape.path} color={shape.color} />
		});
		let current = null;
		if (data.mouseTracker && data.mouseTracker.class) {
			current = <data.mouseTracker.class color={data.mouseTracker.color} path={data.mouseTracker.path} />
		}

		return (
			<svg
				id="whiteBoard"
				width={this.props.width}
				height={this.props.height}
				ref={(canvas) => this._svg = canvas}
			>
				{shapes}
				{current}
				{selection}
			</svg>
		)
	}
}
