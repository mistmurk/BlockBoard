import EventBus from './eventBus'
import ToolStore, { POINTER, PEN, LINE, ELLIPSE, RECT } from './toolStore';
import Line from './components/shapes/line';
import Pen from './components/shapes/pen';
import Rect from './components/shapes/rect';
import Ellipse from './components/shapes/ellipse';
import { pointInsideRect, getShapeRect } from './utils'

export const SELECT = 'Select'
export const DRAW = 'Draw'
export const MOVE = 'Move'
export const RESIZE = 'Resize'

const mapTools = {}
mapTools[LINE] = Line
mapTools[RECT] = Rect
mapTools[ELLIPSE] = Ellipse
mapTools[PEN] = Pen

class Store {
	constructor() {
		this.id = 'whiteBoardStore';
		EventBus.on(EventBus.START_PATH, this.startPath.bind(this))
		EventBus.on(EventBus.MOVE_PATH, this.movePath.bind(this))
		EventBus.on(EventBus.END_PATH, this.endPath.bind(this))
		EventBus.on(EventBus.UNDO, this.undo.bind(this))
		EventBus.on(EventBus.REDO, this.redo.bind(this))
		EventBus.on(EventBus.PICK_VERSION, this.pickVersion.bind(this))
		EventBus.on(EventBus.MOVE, this.move.bind(this))

		this.data = {
			shapes: [],
			selected: [],
			mouseTracker: null
		};
		this.history = [];
		this.tool = Pen;
		this.color = 'black';

		ToolStore.subscribe(() => {
			const tool = ToolStore.tool;
			this.toolType = tool
			this.tool = mapTools[tool] || null
			this.color = ToolStore.color
		})
	}
	subscribe(cb) {
		EventBus.on(this.id, cb);
	}
	emitChanges() {
		EventBus.emit(this.id);
	}
	startPath(event, position) {
		this.data.mouseTracker = {
			class: this.tool,
			type: this.toolType,
			path: [position],
			color: this.color
		}
		if (this.toolType === POINTER) {
			this.selectShape(position)
		}
		this.emitChanges()
	}
	movePath(event, position) {
		//console.log('position',position)
		if (this.data.mouseTracker) {
			this.data.mouseTracker.path.push(position);
			this.emitChanges()
		}
	}
	endPath(event, position) {
		if (this.data.mouseTracker) {
			this.data.mouseTracker.path.push(position);
			if (this.toolType === POINTER) {
				this.addVersion()
			} else if(this.data.mouseTracker.class) {
				this.addShapeToCanvas(this.data.mouseTracker)
			}
			this.data.mouseTracker = null;
			this.emitChanges()
		}
	}
	addShapeToCanvas(shape) {
		this.data.shapes.push(shape)
		this.data.mouseTracker = null
		this.addVersion()
	}
	selectShape(position) {
		this.data.shapes.map(shape => {
			if (pointInsideRect(position, getShapeRect(shape))) {
				return { ...shape, selected: true }
			} else {
				return { ...shape, selected: false }
			}
		})
	}
	addVersion(){
		this.history.push(this.data.shapes.slice());
		console.log(this.history);
	}

	undo() {
		this.pickVersion(null, this.history.length-2);
	}

	pickVersion(event, index) {
		if (this.history && index >= 0) {
			let shapes = this.history[index];
			console.log(shapes);
			console.log(this.history);
			this.data.shapes = shapes;
			this.history.length = index+1;
			this.emitChanges();
		} else {
			this.history = [];
			this.data.shapes = [];
			this.emitChanges();
		}
	}
	move(event, { shape, move }) {
		this.data.shapes.map(s => {
			if (shape === s) {
				return {
					...s, path: s.path.map(({ x, y }) => ({
						x: x + move.x,
						y: y + move.y,
					}))
				}
			} else {
				return s
			}
		})
	}

	redo() { }

	loadJson(js) {
		this.history = [];
		this.data = {
			shapes: [],
			selected: [],
			mouseTracker: null
		};

		let data = JSON.parse(js);
		for(var thing in data.shapes) {
			const type = data.shapes[thing].class;
			if(type === 'Line') {
				data.shapes[thing].class = Line;
			} else if (type === 'Pen') {
				data.shapes[thing].class = Pen;
			} else if (type === 'Rect') {
				data.shapes[thing].class = Rect;
			} else if (type === 'Ellipse') {
				data.shapes[thing].class = Ellipse;
			}
			this.addShapeToCanvas(data.shapes[thing])
		}
		console.log('Loaded', this.data);
		this.emitChanges();
	}
}

export default new Store();
