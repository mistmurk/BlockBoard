import React, {Component} from 'react';

export default class Rect extends Component {
	constructor(){
		super()
	}
	prepareData(){
		let rect = {
			x: Math.min(this.props.path[0].x, this.props.path[this.props.path.length-1].x),
			y: Math.min(this.props.path[0].y, this.props.path[this.props.path.length-1].y),
			width: Math.abs(this.props.path[this.props.path.length-1].x - this.props.path[0].x),
			height: Math.abs(this.props.path[this.props.path.length-1].y - this.props.path[0].y)
		};
	    return rect;
	}

	render(){
		let rect = this.prepareData();
		return (<rect
				x = {rect.x}
				y = {rect.y}
				width = {rect.width}
				height = {rect.height}
				stroke={this.props.color}
		        strokeWidth={1}
		        fill="none"
		      />);
	}
}
