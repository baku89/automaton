(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/colors.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var genColors = function genColors() {
	var colors = {
		accent: "#2af",
		bar: "#f82"
	};

	return colors;
};

exports.default = genColors;

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/gui.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

var _images = require("./images");

var _images2 = _interopRequireDefault(_images);

var _interpolator = require("./interpolator");

var _interpolator2 = _interopRequireDefault(_interpolator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ------

var colors = void 0;
var images = void 0;

var dist = function dist(_x1, _y1, _x2, _y2) {
	var dx = _x2 - _x1;
	var dy = _y2 - _y1;
	return Math.sqrt(dx * dx + dy * dy);
};

var el = function el(_tagorel, _styles, _parent) {
	var e = null;
	if (typeof _tagorel === "string") {
		e = document.createElement(_tagorel);
	} else {
		e = _tagorel;
	}

	for (var k in _styles) {
		e.style[k] = _styles[k];
	}

	if (_parent) {
		_parent.appendChild(e);
	}

	return e;
};

// ------

var Inspector = function Inspector() {
	var inspector = {};
	var text = "";

	var mouseX = 0;
	var mouseY = 0;

	inspector.el = el("div", {
		position: "fixed",
		padding: "2px",
		pointerEvents: "none",

		font: "300 12px Helvetica Neue, sans-serif",

		background: "#000",
		color: "#fff",
		opacity: "0.0"
	});

	window.addEventListener("mousemove", function (_event) {
		mouseX = _event.clientX;
		mouseY = _event.clientY;
	});

	inspector.add = function (_el, _text, _delay) {
		var on = false;
		var id = 0;
		var stack = 0;
		var delay = typeof _delay === "number" ? _delay : 1.0;

		var onenter = function onenter(_event) {
			stack++;
			if (stack !== 1) {
				return;
			}

			on = true;
			id++;
			var cid = id;

			text = _text;

			setTimeout(function () {
				if (on && id === cid) {
					el(inspector.el, {
						opacity: "0.8"
					});
				}
			}, delay * 1000.0);
		};
		_el.addEventListener("mouseenter", onenter);

		var onleave = function onleave(_event) {
			stack--;
			if (stack !== 0) {
				return;
			}

			on = false;

			el(inspector.el, {
				opacity: "0.0"
			});
		};
		_el.addEventListener("mouseleave", onleave);

		var onmousedown = function onmousedown(_event) {
			on = false;

			el(inspector.el, {
				opacity: "0.0"
			});
		};
		_el.addEventListener("mousedown", onmousedown);

		return function () {
			_el.removeEventListener("mouseenter", onenter);
			_el.removeEventListener("mouseleave", onleave);
		};
	};

	var update = function update() {
		if (typeof text === "function") {
			inspector.el.innerText = text();
		} else {
			inspector.el.innerText = text;
		}

		var wid = inspector.el.clientWidth;
		var flip = window.innerWidth - mouseX < wid + 10;
		var attr = {
			left: mouseX + (flip ? -wid - 10 : 10) + "px",
			top: mouseY - 15 + "px"
		};
		el(inspector.el, attr);

		requestAnimationFrame(update);
	};
	update();

	return inspector;
};

// ------

var AutomatonGUI = function AutomatonGUI(_automaton) {
	var gui = {};

	gui.automaton = _automaton;

	// ------

	colors = (0, _colors2.default)();
	images = (0, _images2.default)();

	gui.inspector = Inspector();

	// ------

	var GUI_HEIGHT = 240;
	gui.parent = el("div", {
		position: "fixed",
		left: "0",
		bottom: "0",
		width: "100%",
		height: GUI_HEIGHT + "px",

		background: "#222",
		color: "#ddd",

		userSelect: "none",

		fontFamily: "Helvetica Neue, sans-serif"
	}, document.body);

	// ------

	var HEADER_HEIGHT = 30;
	gui.header = el("div", {
		position: "absolute",
		left: "0",
		top: "0",
		width: "100%",
		height: HEADER_HEIGHT + "px",

		background: "#444"
	}, gui.parent);

	var addHeaderButton = function addHeaderButton(image, inspector, func) {
		var e = el("img", {
			width: "24px",
			height: "24px",
			margin: "3px",

			cursor: "pointer"
		}, gui.header);

		e.src = image;
		gui.inspector.add(e, inspector, 0.5);
		e.addEventListener("click", function (_event) {
			if (_event.which === 1) {
				func();
			}
		});
	};

	addHeaderButton(images.config, "Config", function () {
		gui.config();
	});

	addHeaderButton(images.save, "Save", function () {
		gui.save();
	});

	// ------

	var PARAMLIST_WIDTH = 120;
	gui.paramList = el("div", {
		position: "absolute",
		left: "0",
		top: HEADER_HEIGHT + "px",
		width: PARAMLIST_WIDTH + "px",
		height: "calc( 100% - " + HEADER_HEIGHT + "px )",

		background: "#111",

		overflow: "hidden"
	}, gui.parent);
	gui.paramListChildren = [];
	gui.currentParamIndex = -1;
	gui.currentParamName = "";
	gui.currentParam = null;

	gui.paramListInside = el("div", {
		position: "absolute",
		top: "0px",
		width: "100%"
	}, gui.paramList);
	var paramListInsidePos = 0;
	gui.paramListInside.addEventListener("wheel", function (_event) {
		paramListInsidePos = Math.max(Math.min(paramListInsidePos + _event.deltaY, gui.paramListInside.clientHeight - (GUI_HEIGHT - HEADER_HEIGHT)), 0);
		el(gui.paramListInside, { top: -paramListInsidePos + "px" });
	});

	var MODMENU_WIDTH = 200;
	gui.modMenu = el("div", {
		position: "absolute",
		right: "0",
		top: HEADER_HEIGHT + "px",
		width: MODMENU_WIDTH + "px",
		height: "100%",

		background: "#333",

		overflow: "hidden"
	}, gui.parent);

	gui.modMenuInside = el("div", {
		position: "absolute",
		top: "0px",
		width: "calc( 100% - 20px )",
		padding: "20px 10px"
	}, gui.modMenu);
	var modMenuInsidePos = 0;
	gui.modMenuInside.addEventListener("wheel", function (_event) {
		modMenuInsidePos = Math.max(Math.min(modMenuInsidePos + _event.deltaY, gui.modMenuInside.clientHeight - (GUI_HEIGHT - HEADER_HEIGHT)), 0);
		el(gui.modMenuInside, { top: -modMenuInsidePos + "px" });
	});

	gui.timeline = el("div", {
		position: "absolute",
		left: PARAMLIST_WIDTH + "px",
		top: HEADER_HEIGHT + "px",
		width: "calc( 100% - " + (PARAMLIST_WIDTH + MODMENU_WIDTH) + "px )",
		height: "calc( 100% - " + HEADER_HEIGHT + "px )",

		background: "#222",

		overflow: "hidden"
	}, gui.parent);

	gui.timelineCanvas = el("canvas", {
		position: "absolute",
		width: "100%",
		height: "100%"
	}, gui.timeline);
	gui.timelineContext = gui.timelineCanvas.getContext("2d");

	// ------

	gui.dialogContainer = el("div", {
		position: "absolute",
		display: "none",
		width: "100%",
		height: "100%"
	}, gui.parent);

	gui.dialogBackground = el("div", {
		position: "absolute",
		width: "100%",
		height: "100%",

		background: "#000",
		opacity: 0.5
	}, gui.dialogContainer);

	gui.dialog = el("div", {
		position: "absolute",

		background: "#333"
	}, gui.dialogContainer);

	gui.dialogContent = el("div", {
		position: "absolute",
		top: "16px",
		width: "100%",
		height: "24px",

		textAlign: "center",
		whiteSpace: "pre-wrap"
	}, gui.dialog);

	gui.dialogButtonContainer = el("div", {
		position: "absolute",
		bottom: "16px",
		width: "100%",
		height: "24px",

		textAlign: "center"
	}, gui.dialog);

	gui.addDialogButton = function (_text, _func) {
		var e = el("div", {
			display: "inline-block",
			width: "60px",
			height: "16px",
			padding: "4px",
			margin: "0 5px",

			textAlign: "center",
			background: "#555",

			cursor: "pointer"
		}, gui.dialogButtonContainer);
		e.innerText = _text;

		e.addEventListener("click", function (_event) {
			if (_event.which === 1) {
				_func();
			}
		});
	};

	gui.showDialog = function (w, h) {
		el(gui.dialogContainer, { display: "block" });
		el(gui.dialog, _defineProperty({
			left: "calc( 50% - " + w / 2 + "px )",
			top: "calc( 50% - " + h / 2 + "px )",
			height: "",
			width: w + "px"
		}, "height", h + "px"));
	};

	gui.hideDialog = function () {
		el(gui.dialogContainer, { display: "none" });

		while (gui.dialogContent.firstChild) {
			gui.dialogContent.removeChild(gui.dialogContent.firstChild);
		}

		while (gui.dialogButtonContainer.firstChild) {
			gui.dialogButtonContainer.removeChild(gui.dialogButtonContainer.firstChild);
		}
	};
	window.addEventListener("keydown", function (_event) {
		if (_event.which === 27) {
			gui.hideDialog();
		}
	});

	// ------

	gui.configLength = function (_len) {
		gui.automaton.length = _len;

		for (var paramName in gui.automaton.params) {
			var param = gui.automaton.params[paramName];

			for (var iNode = param.nodes.length - 1; 0 < iNode; iNode--) {
				var node = param.nodes[iNode];
				if (_len < node.time) {
					param.nodes.splice(iNode, 1);
				}
			}

			var lastNode = param.nodes[param.nodes.length - 1];
			if (lastNode.time !== _len) {
				param.addNode(_len, 0.0);
			}
		}
	};

	gui.configConfirm = function (_len) {
		var divMessage = el("div", {}, gui.dialogContent);
		divMessage.innerText = "Shortening length may cause loss of node data.\nContinue?";

		gui.addDialogButton("Shorten", function () {
			gui.configLength(_len);
			gui.hideDialog();
		});
		gui.addDialogButton("Cancel", function () {
			gui.hideDialog();
		});
		gui.showDialog(400, 100);
	};

	gui.config = function () {
		var inp = function inp(_name, _value) {
			var parent = el("div", {
				position: "relative",
				width: "200px",
				height: "20px",
				margin: "0 20px 10px 20px"
			}, gui.dialogContent);

			var label = el("div", {
				position: "absolute",
				left: "0"
			}, parent);
			label.innerText = _name;

			var input = el("input", {
				position: "absolute",
				right: "0",
				padding: "4px",
				width: "60px",
				border: "none",

				background: "#666",
				color: "#fff"
			}, parent);
			input.value = _value;
			input.addEventListener("keydown", function (event) {
				if (event.which === 13) {
					event.preventDefault();
					okFunc();
				}
			});

			return {
				parent: parent,
				label: label,
				input: input
			};
		};

		var okFunc = function okFunc() {
			gui.hideDialog();

			var l = parseFloat(inpLen.input.value);
			if (!isNaN(l)) {
				if (l < gui.automaton.length) {
					gui.configConfirm(l);
				} else {
					gui.configLength(l);
				}
			}

			var r = parseInt(inpReso.input.value);
			if (!isNaN(r)) {
				gui.automaton.resolution = r;
			}

			gui.automaton.renderAll();
		};

		var inpLen = inp("Length", gui.automaton.length);
		var inpReso = inp("Resolution", gui.automaton.resolution);

		gui.addDialogButton("OK", okFunc);
		gui.addDialogButton("Cancel", function () {
			gui.hideDialog();
		});
		gui.showDialog(240, 120);
	};

	// ------

	gui.save = function () {
		var obj = {
			length: gui.automaton.length,
			resolution: gui.automaton.resolution
		};

		obj.params = {};
		for (var name in gui.automaton.params) {
			var param = gui.automaton.params[name];
			obj.params[name] = param.nodes;
		}

		// ------

		var divMessage = el("div", {}, gui.dialogContent);
		divMessage.innerText = "Copy the JSON below";

		var inputJSON = el("input", {
			margin: "10px",
			padding: "4px",
			width: "100px",
			border: "none",

			background: "#666",
			color: "#fff"
		}, gui.dialogContent);
		inputJSON.value = JSON.stringify(obj);
		inputJSON.readOnly = true;

		gui.addDialogButton("OK", function () {
			gui.hideDialog();
		});
		gui.showDialog(200, 120);

		inputJSON.select();
	};

	// ------

	gui.addParam = function (_name, _index) {
		var e = el("div", {
			margin: "2px",
			padding: "2px 8px",
			width: "calc( 100% - 4px - 16px )",
			height: "20px",

			fontSize: "14px",

			background: "#333",

			cursor: "pointer"
		}, gui.paramListInside);
		e.innerText = _name;
		e.addEventListener("mousedown", function (_event) {
			if (_event.which === 1) {
				gui.selectParam(_index);
				gui.updateTimeline(true);
			} else {
				// TODO: context menu
				// e.g. copy, paste...
			}
		});

		var param = gui.automaton.params[_name];
		gui.inspector.add(e, function () {
			return param.getValue().toFixed(3);
		}, 0.5);

		gui.paramListChildren.push(e);
	};

	gui.clearParamList = function () {
		while (gui.paramListInside.firstChild) {
			gui.paramListInside.removeChild(gui.paramListInside.firstChild);
		}
		gui.paramListChildren = [];
	};

	gui.updateParamList = function () {
		gui.clearParamList();

		var paramList = gui.automaton.getParamNames();

		paramList.map(function (_name, _index) {
			gui.addParam(_name, _index);
		});

		gui.selectParam(gui.currentParamIndex);
	};

	gui.timelineMin = 0.0;
	gui.timelineMax = 0.0;
	gui.canvasWidth = 0.0;
	gui.canvasHeight = 0.0;

	gui.mapTime = function (_time) {
		return gui.canvasWidth * _time / gui.automaton.length;
	};
	gui.mapValue = function (_value) {
		return gui.canvasHeight * (0.1 + 0.8 * ((gui.timelineMax - _value) / (gui.timelineMax - gui.timelineMin)));
	};
	gui.rmapTime = function (_x) {
		return _x / gui.canvasWidth * gui.automaton.length;
	};
	gui.rmapValue = function (_y) {
		return (0.1 - _y / gui.canvasHeight) / 0.8 * (gui.timelineMax - gui.timelineMin) + gui.timelineMax;
	};

	gui.timelineNodeRadius = 5.0;

	gui.selectedTimelineNode = -1;
	gui.selectTimelineNode = function (_index) {
		gui.selectedTimelineNode = _index;

		gui.resetModMenu();
	};

	gui.grabbingTimelineNode = -1;
	gui.grabTimelineNode = function (_index) {
		gui.grabbingTimelineNode = _index;
		gui.selectTimelineNode(_index);
	};

	var lastClick = 0;
	gui.timelineCanvas.addEventListener("mousedown", function (_event) {
		var param = gui.currentParam;
		if (!param) {
			return;
		}

		var rect = gui.timeline.getBoundingClientRect();

		var now = +new Date();
		if (now - lastClick < 500) {
			var removed = false;
			param.nodes.map(function (node, index) {
				var x = gui.mapTime(node.time);
				var y = gui.mapValue(node.value);
				if (dist(x, y, _event.clientX - rect.left, _event.clientY - rect.top) < gui.timelineNodeRadius) {
					param.removeNode(index);
					gui.selectTimelineNode(-1);
					removed = true;
				}
			});
			if (removed) {
				return;
			}

			var node = param.addNode(gui.rmapTime(_event.clientX - rect.left), gui.rmapValue(_event.clientY - rect.top));
			gui.grabTimelineNode(param.nodes.indexOf(node));
		} else {
			param.nodes.map(function (node, index) {
				var x = gui.mapTime(node.time);
				var y = gui.mapValue(node.value);
				if (dist(x, y, _event.clientX - rect.left, _event.clientY - rect.top) < gui.timelineNodeRadius) {
					gui.grabTimelineNode(index);
				}
			});
		}
		lastClick = now;
	});

	window.addEventListener("mousemove", function (_event) {
		if (gui.grabbingTimelineNode !== -1) {
			var param = gui.currentParam;
			var node = param.nodes[gui.grabbingTimelineNode];

			var rect = gui.timeline.getBoundingClientRect();
			param.setTime(gui.grabbingTimelineNode, gui.rmapTime(_event.clientX - rect.left));
			param.setValue(gui.grabbingTimelineNode, gui.rmapValue(_event.clientY - rect.top));

			gui.updateModMenu();
		}
	});

	window.addEventListener("mouseup", function (_event) {
		if (gui.grabbingTimelineNode !== -1) {
			gui.grabbingTimelineNode = -1;
		}
	});

	gui.updateTimelineRange = function () {
		var param = gui.currentParam;
		if (!param) {
			return;
		}

		gui.timelineMin = 0.0;
		gui.timelineMax = 0.0;
		param.nodes.map(function (node) {
			gui.timelineMin = Math.min(gui.timelineMin, node.value);
			gui.timelineMax = Math.max(gui.timelineMax, node.value);
		});

		if (gui.timelineMin === gui.timelineMax) {
			gui.timelineMin -= 0.5;
			gui.timelineMax += 0.5;
		}
	};

	gui.updateTimelineCanvas = function (param) {
		gui.timelineContext.clearRect(0, 0, gui.canvasWidth, gui.canvasHeight);

		// -----

		gui.timelineContext.beginPath();
		gui.timelineContext.moveTo(0, gui.mapValue(param.getValue(0.0)));

		for (var i = 1; i < gui.timelineCanvas.width; i++) {
			var t = i / gui.timelineCanvas.width * gui.automaton.length;
			var y = gui.mapValue(param.getValue(t));
			gui.timelineContext.lineTo(i, y);
		}

		gui.timelineContext.strokeStyle = colors.accent;
		gui.timelineContext.lineWidth = 2;
		gui.timelineContext.lineCap = "round";
		gui.timelineContext.lineJoin = "round";
		gui.timelineContext.stroke();

		// ------

		var barX = gui.mapTime(gui.automaton.time);
		var barY = gui.mapValue(gui.currentParam.getValue(gui.automaton.time));

		gui.timelineContext.fillStyle = colors.bar;
		gui.timelineContext.fillRect(barX - 1, 0, 2, gui.canvasHeight);

		gui.timelineContext.beginPath();
		gui.timelineContext.arc(barX, barY, 4.0, 0.0, Math.PI * 2.0, false);
		gui.timelineContext.fill();

		// ------

		param.nodes.map(function (node, index) {
			var x = gui.mapTime(node.time);
			var y = gui.mapValue(node.value);

			if (gui.selectedTimelineNode === index) {
				gui.timelineContext.beginPath();
				gui.timelineContext.arc(x, y, gui.timelineNodeRadius, 0, Math.PI * 2.0, false);
				gui.timelineContext.fillStyle = colors.accent;
				gui.timelineContext.strokeStyle = "#222";
				gui.timelineContext.lineWidth = 4;
				gui.timelineContext.stroke();
				gui.timelineContext.fill();
			} else {
				gui.timelineContext.beginPath();
				gui.timelineContext.arc(x, y, gui.timelineNodeRadius - 1, 0, Math.PI * 2.0, false);
				gui.timelineContext.fillStyle = "#222";
				gui.timelineContext.strokeStyle = colors.accent;
				gui.timelineContext.lineWidth = 4;
				gui.timelineContext.stroke();
				gui.timelineContext.fill();
			}
		});
	};

	gui.updateTimeline = function () {
		gui.canvasWidth = window.innerWidth - PARAMLIST_WIDTH - MODMENU_WIDTH;
		gui.canvasHeight = GUI_HEIGHT - HEADER_HEIGHT;
		gui.timelineCanvas.width = gui.canvasWidth;
		gui.timelineCanvas.height = gui.canvasHeight;

		var param = gui.currentParam;
		if (!param) {
			return;
		}

		gui.updateTimelineCanvas(param);
	};

	gui.paramBoxListeners = [];
	gui.resetModMenu = function () {
		var param = gui.currentParam;
		if (!param) {
			return;
		}

		while (gui.modMenuInside.firstChild) {
			gui.modMenuInside.removeChild(gui.modMenuInside.firstChild);
		}
		gui.paramBoxListeners = [];

		var node = param.nodes[gui.selectedTimelineNode];
		if (!node) {
			return;
		}

		// ------

		var sep = function sep() {
			el("div", {
				width: "170px",
				height: "1px",
				margin: "0 5px 5px 5px",

				background: "#666"
			}, gui.modMenuInside);
		};

		// ------

		var genParamBox = function genParamBox(_name, _funcGet, _funcSet, _parent) {
			var func = function func(_value) {
				var v = parseFloat(_value);
				v = isNaN(v) ? 0.0 : v;
				valueText.innerText = v.toFixed(3);
				valueBox.value = v;
				if (typeof _funcSet === "function") {
					_funcSet(v);
					v = _funcGet();
					valueText.innerText = v.toFixed(3);
					valueBox.value = v;
				}
			};

			var parent = el("div", {
				position: "relative",
				margin: "0 0 5px 0",
				width: "100%",
				height: "14px",

				fontSize: "12px"
			}, _parent);

			var name = el("div", {
				position: "absolute",
				left: "20px",
				top: "0",
				width: "50px",
				height: "100%"
			}, parent);
			name.innerText = _name;

			var value = el("div", {
				position: "absolute",
				right: "10px",
				top: "0",
				width: "60px",
				height: "100%"
			}, parent);

			var valueText = el("div", {
				position: "absolute",
				left: "0",
				top: "0",
				width: "100%",
				height: "100%",

				textAlign: "center",

				cursor: "pointer"
			}, value);
			var lastClick = 0;
			valueText.addEventListener("mousedown", function (event) {
				var now = +new Date();
				if (now - lastClick < 500) {
					el(valueBox, { display: "block" });
					setTimeout(function () {
						return valueBox.focus();
					}, 10);
				} else {
					(function () {
						var lastY = event.clientY;

						var moveFunc = function moveFunc(event) {
							var v = parseFloat(valueText.innerText);
							var y = event.clientY;
							var d = lastY - y;
							lastY = y;

							if (event.shiftKey) {
								var c = Math.abs(d);
								var ds = Math.sign(d);
								for (var i = 0; i < c; i++) {
									var va = Math.abs(v);
									var vs = Math.sign(v + 1E-4 * ds);
									var l = Math.floor(Math.log10(va + 1E-4 * ds * vs)) - 1 - (event.altKey ? 1 : 0);
									var r = Math.max(0.001, Math.pow(10.0, l)) * ds;
									v = parseFloat((v + r).toFixed(3));
								}
								func(v);
							} else {
								var _r = event.altKey ? 0.001 : 0.01;
								func((v + d * _r).toFixed(3));
							}
						};

						var upFunc = function upFunc(event) {
							window.removeEventListener("mousemove", moveFunc);
							window.removeEventListener("mouseup", upFunc);
						};

						window.addEventListener("mousemove", moveFunc);
						window.addEventListener("mouseup", upFunc);
					})();
				}
				lastClick = now;
			});

			var valueBox = el("input", {
				position: "absolute",
				display: "none",
				left: "0",
				top: "0",
				width: "100%",
				height: "100%",

				border: "none",
				padding: "0",

				background: "#666",
				color: "#fff",
				textAlign: "center"
			}, value);
			valueBox.addEventListener("keydown", function (event) {
				if (event.which === 13) {
					event.preventDefault();
					func(valueBox.value);
					el(valueBox, { display: "none" });
				}
			});
			valueBox.addEventListener("blur", function () {
				func(valueBox.value);
				el(valueBox, { display: "none" });
			});

			func(_funcGet());
			gui.paramBoxListeners.push(function () {
				var v = _funcGet();
				valueText.innerText = v.toFixed(3);
				valueBox.value = v;
			});

			return param;
		};

		// ------

		genParamBox("time", function () {
			return node.time;
		}, function (value) {
			return param.setTime(gui.selectedTimelineNode, value);
		}, gui.modMenuInside);

		genParamBox("value", function () {
			return node.value;
		}, function (value) {
			return param.setValue(gui.selectedTimelineNode, value);
		}, gui.modMenuInside);

		sep();

		// ------

		var modesContainer = el("div", {
			margin: "5px 5px 0 5px",
			width: "180px"
		}, gui.modMenuInside);

		var selectedMode = node.mode;
		var modeEls = [];

		var _loop = function _loop(i) {
			var e = el("img", {
				width: "30px",
				height: "30px",

				margin: "2px",

				cursor: "pointer",

				filter: i === selectedMode ? "" : "grayscale( 90% )"
			}, modesContainer);
			modeEls.push(e);
			e.src = images.modes[i];
			e.addEventListener("mousedown", function (_event) {
				param.setMode(gui.selectedTimelineNode, i);
				gui.resetModMenu();
			});
			gui.inspector.add(e, _interpolator2.default.modeNames[i], 0.5);
		};

		for (var i = 0; i < _interpolator2.default.MODES; i++) {
			_loop(i);
		}

		var _loop2 = function _loop2(p) {
			genParamBox(p, function () {
				return node.params[p];
			}, function (value) {
				var obj = {};
				obj[p] = value;
				param.setParams(gui.selectedTimelineNode, obj);
			}, gui.modMenuInside);
		};

		for (var p in node.params) {
			_loop2(p);
		}

		sep();

		var _loop3 = function _loop3(m) {
			var parent = el("div", {
				position: "relative",
				margin: "10px 0 20px 0",
				width: "100%",
				minHeight: "24px"
			}, gui.modMenuInside);

			var icon = el("img", {
				position: "absolute",
				width: "24px",
				height: "24px",

				left: "10px",

				cursor: "pointer",

				filter: node.mods[m] ? "" : "grayscale( 90% )"
			}, parent);
			icon.src = images.mods[m];
			icon.addEventListener("mousedown", function (_event) {
				param.activeModParams(gui.selectedTimelineNode, m, !node.mods[m]);
				gui.resetModMenu();
			});
			gui.inspector.add(icon, _interpolator2.default.modNames[m], 0.5);

			if (node.mods[m]) {
				var params = el("div", {
					position: "relative",
					left: "30px",
					width: "calc( 100% - 30px )"
				}, parent);

				var _loop4 = function _loop4(_p) {
					genParamBox(_p, function () {
						return node.mods[m][_p];
					}, function (value) {
						var obj = {};
						obj[_p] = value;
						param.setModParams(gui.selectedTimelineNode, m, obj);
					}, params);
				};

				for (var _p in node.mods[m]) {
					_loop4(_p);
				}
			}
		};

		for (var m = 0; m < _interpolator2.default.MODS; m++) {
			_loop3(m);
		}
	};

	gui.updateModMenu = function () {
		gui.paramBoxListeners.map(function (func) {
			func();
		});
	};

	gui.selectParam = function (_index) {
		if (_index < 0 || gui.paramListChildren.length <= _index) {
			return;
		}

		if (gui.currentParam) {
			el(gui.paramListChildren[gui.currentParamIndex], {
				background: "#333"
			});
		}

		gui.currentParamIndex = _index;
		gui.currentParamName = gui.paramListChildren[gui.currentParamIndex].innerText;
		gui.currentParam = gui.automaton.params[gui.currentParamName];

		el(gui.paramListChildren[gui.currentParamIndex], {
			background: "#555"
		});

		gui.updateTimelineRange();

		gui.selectTimelineNode(-1);
	};

	// ------

	el(gui.inspector.el, {}, document.body);

	// ------

	gui.update = function () {
		gui.updateTimeline();

		if (gui.paramListChildren.length !== gui.automaton.countParams()) {
			gui.updateParamList();
		}
	};

	gui.resize = function () {
		gui.updateTimeline();
	};
	window.addEventListener("resize", gui.resize);

	// ------

	gui.updateParamList();
	gui.selectParam(0);
	gui.updateTimelineRange();
	gui.updateTimeline();

	return gui;
};

exports.default = AutomatonGUI;

},{"./colors":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/colors.js","./images":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/images.js","./interpolator":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/interpolator.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/images.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interpolator = require("./interpolator");

var _interpolator2 = _interopRequireDefault(_interpolator);

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colors = void 0;

var genImages = function genImages() {
  var images = {};

  colors = (0, _colors2.default)();

  var canvas = document.createElement("canvas");
  var s = canvas.width = canvas.height = 128;
  var context = canvas.getContext("2d");

  context.lineCap = "round";
  context.lineJoin = "round";

  var genImage = function genImage(_func) {
    context.save();
    context.clearRect(0, 0, s, s);
    _func();
    context.restore();

    return canvas.toDataURL();
  };

  // ------

  images.modes = [];

  var _loop = function _loop(i) {
    images.modes[i] = genImage(function () {
      context.beginPath();
      context.moveTo(s / 8.0, s / 8.0 * 7.0);
      var arr = _interpolator2.default.generate({
        mode: i
      });
      for (var _i4 = 1; _i4 < arr.length; _i4++) {
        context.lineTo(s / 8.0 + s / 4.0 * 3.0 * _i4 / arr.length, s / 8.0 * 7.0 - s / 4.0 * 3.0 * arr[_i4]);
      }

      context.strokeStyle = colors.accent;
      context.lineWidth = s / 12.0;
      context.stroke();
    });
  };

  for (var i = 0; i < _interpolator2.default.MODES; i++) {
    _loop(i);
  }

  // ------

  images.mods = [];

  images.mods[_interpolator2.default.MOD_RESET] = genImage(function () {
    context.beginPath();
    context.arc(s / 2.0, s / 2.0, s / 3.0, -Math.PI / 4.0, Math.PI / 4.0 * 5.0, false);
    context.moveTo(s / 2.0, s / 2.0);
    context.lineTo(s / 2.0, s / 8.0);

    context.strokeStyle = colors.accent;
    context.lineWidth = s / 12.0;
    context.stroke();
  });

  images.mods[_interpolator2.default.MOD_SIN] = genImage(function () {
    context.beginPath();
    context.moveTo(s / 8.0, s / 2.0);
    var arr = _interpolator2.default.generate({
      mode: _interpolator2.default.MODE_LINEAR,
      start: 0.5,
      end: 0.5,
      mods: [null, { active: true }, null]
    });
    for (var _i = 1; _i < arr.length; _i++) {
      context.lineTo(s / 8.0 + s / 4.0 * 3.0 * _i / arr.length, s / 8.0 * 7.0 - s / 4.0 * 3.0 * arr[_i]);
    }

    context.strokeStyle = colors.accent;
    context.lineWidth = s / 12.0;
    context.stroke();
  });

  images.mods[_interpolator2.default.MOD_NOISE] = genImage(function () {
    context.beginPath();
    context.moveTo(s / 8.0, s / 2.0);
    var arr = _interpolator2.default.generate({
      mode: _interpolator2.default.MODE_LINEAR,
      start: 0.5,
      end: 0.5,
      mods: [null, null, { active: true }]
    });
    for (var _i2 = 1; _i2 < arr.length; _i2++) {
      context.lineTo(s / 8.0 + s / 4.0 * 3.0 * _i2 / arr.length, s / 8.0 * 7.0 - s / 4.0 * 3.0 * arr[_i2]);
    }

    context.strokeStyle = colors.accent;
    context.lineWidth = s / 12.0;
    context.stroke();
  });

  // ------

  images.save = genImage(function () {
    context.beginPath();
    context.moveTo(s / 8.0, s / 8.0);
    context.lineTo(s / 8.0, s / 8.0 * 7.0);
    context.lineTo(s / 8.0 * 7.0, s / 8.0 * 7.0);
    context.lineTo(s / 8.0 * 7.0, s / 4.0);
    context.lineTo(s / 4.0 * 3.0, s / 8.0);
    context.closePath();

    context.moveTo(s / 4.0, s / 2.0);
    context.lineTo(s / 4.0 * 3.0, s / 2.0);
    context.lineTo(s / 4.0 * 3.0, s / 6.0 * 5.0);
    context.lineTo(s / 4.0, s / 6.0 * 5.0);
    context.closePath();

    context.moveTo(s / 4.0, s / 6.0);
    context.lineTo(s / 3.0 * 2.0, s / 6.0);
    context.lineTo(s / 3.0 * 2.0, s / 8.0 * 3.0);
    context.lineTo(s / 4.0, s / 8.0 * 3.0);
    context.closePath();

    context.moveTo(s / 2.0, s / 5.0);
    context.lineTo(s / 8.0 * 5.0, s / 5.0);
    context.lineTo(s / 8.0 * 5.0, s / 3.0);
    context.lineTo(s / 2.0, s / 3.0);
    context.closePath();

    context.fillStyle = colors.accent;
    context.fill();
  });

  images.config = genImage(function () {
    context.beginPath();
    var c = s / 2.0;
    for (var _i3 = 0; _i3 < 24; _i3++) {
      var r = (_i3 & 2) === 0 ? s * 0.42 : s * 0.30;
      var t = Math.PI * (_i3 - 0.5) / 12.0;

      if (_i3 === 0) {
        context.moveTo(c + Math.cos(t) * r, c + Math.sin(t) * r);
      } else {
        context.lineTo(c + Math.cos(t) * r, c + Math.sin(t) * r);
      }
    }
    context.closePath();

    context.arc(c, c, s * 0.15, 0.0, Math.PI * 2.0, true);

    context.fillStyle = colors.accent;
    context.fill();
  });

  images.save = genImage(function () {
    context.beginPath();
    context.moveTo(s / 8.0, s / 8.0);
    context.lineTo(s / 8.0, s / 8.0 * 7.0);
    context.lineTo(s / 8.0 * 7.0, s / 8.0 * 7.0);
    context.lineTo(s / 8.0 * 7.0, s / 4.0);
    context.lineTo(s / 4.0 * 3.0, s / 8.0);
    context.closePath();

    context.moveTo(s / 4.0, s / 2.0);
    context.lineTo(s / 4.0 * 3.0, s / 2.0);
    context.lineTo(s / 4.0 * 3.0, s / 6.0 * 5.0);
    context.lineTo(s / 4.0, s / 6.0 * 5.0);
    context.closePath();

    context.moveTo(s / 4.0, s / 6.0);
    context.lineTo(s / 3.0 * 2.0, s / 6.0);
    context.lineTo(s / 3.0 * 2.0, s / 8.0 * 3.0);
    context.lineTo(s / 4.0, s / 8.0 * 3.0);
    context.closePath();

    context.moveTo(s / 2.0, s / 5.0);
    context.lineTo(s / 8.0 * 5.0, s / 5.0);
    context.lineTo(s / 8.0 * 5.0, s / 3.0);
    context.lineTo(s / 2.0, s / 3.0);
    context.closePath();

    context.fillStyle = colors.accent;
    context.fill();
  });

  return images;
};

exports.default = genImages;

},{"./colors":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/colors.js","./interpolator":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/interpolator.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/interpolator.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _noise = require("./noise");

var _noise2 = _interopRequireDefault(_noise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cloneObj = function cloneObj(_obj) {
  var obj = {};
  for (var key in _obj) {
    obj[key] = _obj[key];
  }
  return obj;
};

// ------

var def = function def(_a, _b) {
  return typeof _a === "number" ? _a : _b;
};

// ------

var Interpolator = {};

// ------

Interpolator.MODE_HOLD = 0;
Interpolator.MODE_LINEAR = 1;
Interpolator.MODE_SMOOTH = 2;
Interpolator.MODE_EXP = 3;
Interpolator.MODE_SPRING = 4;
Interpolator.MODE_GRAVITY = 5;
Interpolator.MODES = 6;

Interpolator.modeNames = ["Hold", "Linear", "Smoothstep", "Exp. Smooth", "Critically Damped Spring", "Gravity and Bounce"];

Interpolator.MOD_RESET = 0;
Interpolator.MOD_SIN = 1;
Interpolator.MOD_NOISE = 2;
Interpolator.MODS = 3;

Interpolator.modNames = ["Reset", "Sine Curve", "Perlin Noise"];

// ------

Interpolator.generate = function (_params) {
  var params = (typeof _params === "undefined" ? "undefined" : _typeof(_params)) === "object" ? _params : {};

  var mode = def(params.mode, Interpolator.MODE_LINEAR);
  var start = def(params.start, 0.0);
  var end = def(params.end, 1.0);
  var length = def(params.length, 32);
  var deltaTime = def(params.deltaTime, 0.01);

  var mods = _typeof(params.mods) === "object" ? cloneObj(params.mods) : [];
  for (var i = 0; i < Interpolator.MODS; i++) {
    mods[i] = mods[i] ? mods[i] : false;
  }

  var arr = [start];

  if (mode === Interpolator.MODE_HOLD) {
    for (var _i = 1; _i < length; _i++) {
      arr[_i] = start;
    }
    arr[length - 1] = end;
  } else if (mode === Interpolator.MODE_LINEAR) {
    for (var _i2 = 1; _i2 < length; _i2++) {
      var prog = _i2 / (length - 1);
      arr[_i2] = start + (end - start) * prog;
    }
  } else if (mode === Interpolator.MODE_SMOOTH) {
    for (var _i3 = 1; _i3 < length; _i3++) {
      var _prog = _i3 / (length - 1);
      var smooth = _prog * _prog * (3.0 - 2.0 * _prog);
      arr[_i3] = start + (end - start) * smooth;
    }
  } else if (mode === Interpolator.MODE_EXP) {
    var factor = def(params.factor, 10.0);
    for (var _i4 = 1; _i4 < length; _i4++) {
      var time = _i4 * deltaTime;
      var curve = 1.0 - Math.exp(-factor * time);
      arr[_i4] = start + (end - start) * curve;
    }
  } else if (mode === Interpolator.MODE_SPRING) {
    var rate = def(params.rate, 500.0);
    var damp = def(params.damp, 1.0);
    var vel = def(params.vel, 0.0);
    var pos = start;
    for (var _i5 = 1; _i5 < length; _i5++) {
      vel += (-rate * (pos - end) - 2.0 * vel * Math.sqrt(rate) * damp) * deltaTime;
      pos += vel * deltaTime;
      arr[_i5] = pos;
    }
  } else if (mode === Interpolator.MODE_GRAVITY) {
    var gravity = def(params.gravity, 70.0);
    var bounce = def(params.bounce, 0.3);
    var _vel = def(params.vel, 0.0);
    var sig = Math.sign(end - start);
    var _pos = start;
    for (var _i6 = 1; _i6 < length; _i6++) {
      _vel += gravity * sig * deltaTime;
      _pos += _vel * deltaTime;
      if (sig !== Math.sign(end - _pos)) {
        _pos = end + (end - _pos) * bounce;
        _vel *= -bounce;
      }
      arr[_i6] = _pos;
    }
  }

  if (mods[Interpolator.MOD_SIN]) {
    var freq = def(mods[Interpolator.MOD_SIN].freq, 2.0);
    var amp = def(mods[Interpolator.MOD_SIN].amp, 0.5);
    var phase = def(mods[Interpolator.MOD_SIN].phase, 0.0);
    for (var _i7 = 0; _i7 < length; _i7++) {
      arr[_i7] += Math.sin(phase * Math.PI * 2.0) * amp;
      phase = (phase + 1.0 / (length - 1) * freq) % 1.0;
    }
  }

  if (mods[Interpolator.MOD_NOISE]) {
    var _amp = def(mods[Interpolator.MOD_NOISE].amp, 1.0);

    var noise = (0, _noise2.default)({
      length: length,
      recursion: def(mods[Interpolator.MOD_NOISE].recursion, 3.0),
      freq: def(mods[Interpolator.MOD_NOISE].freq, 1.0) * (length - 1) / length,
      reso: def(mods[Interpolator.MOD_NOISE].reso, 4.0),
      seed: def(mods[Interpolator.MOD_NOISE].seed, 175.0)
    });

    for (var _i8 = 0; _i8 < length; _i8++) {
      arr[_i8] += noise[_i8] * _amp;
    }
  }

  return arr;
};

// ------

exports.default = Interpolator;

},{"./noise":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/noise.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/main.js":[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _param = require("./param");

var _param2 = _interopRequireDefault(_param);

var _gui = require("./gui");

var _gui2 = _interopRequireDefault(_gui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------

var Automaton = function Automaton(_props) {
	var automaton = {};

	var props = (typeof _props === "undefined" ? "undefined" : _typeof(_props)) === "object" ? _props : {};
	var data = props.data ? JSON.parse(props.data) : {};

	automaton.time = 0.0;
	automaton.length = typeof data.length === "number" ? data.length : 1.0;
	automaton.resolution = typeof data.resolution === "number" ? data.resolution : 1000.0;

	// ------

	automaton.params = {};
	automaton.createParam = function (_name) {
		var param = new _param2.default(automaton);
		automaton.params[_name] = param;

		return param;
	};

	automaton.getParamNames = function () {
		var arr = [];
		for (var name in automaton.params) {
			arr.push(name);
		}
		arr = arr.sort();
		return arr;
	};

	automaton.countParams = function () {
		var sum = 0;
		for (var name in automaton.params) {
			sum++;
		}
		return sum;
	};

	// ------

	if (props.gui) {
		automaton.gui = (0, _gui2.default)(automaton);
	}

	// ------

	automaton.renderAll = function () {
		for (var name in automaton.params) {
			automaton.params[name].render();
		}
	};

	automaton.update = function (_time) {
		automaton.time = _time % automaton.length;

		if (automaton.gui) {
			automaton.gui.update();
		}
	};

	automaton.auto = function (_name) {
		if (!automaton.params[_name]) {
			var param = automaton.createParam(_name);
			if (data.params && data.params[_name]) {
				param.load(data.params[_name]);
			}
		}

		return automaton.params[_name].getValue();
	};
	return automaton;
};

window.Automaton = Automaton;
if (typeof module !== "undefined") {
	module.exports = Automaton;
}

},{"./gui":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/gui.js","./param":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/param.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/noise.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _xorshift = require("./xorshift");

var _xorshift2 = _interopRequireDefault(_xorshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var int = function int(_a, _b, _k) {
  var smooth = _k * _k * (3.0 - 2.0 * _k);
  return _a + (_b - _a) * smooth;
};

var genNoise = function genNoise(_params) {
  var params = (typeof _params === "undefined" ? "undefined" : _typeof(_params)) === "object" ? _params : {
    length: 32,
    recursion: 6,
    freq: 1.0,
    reso: 4,
    seed: 0
  };
  params.length = parseInt(params.length);
  params.recursion = parseInt(params.recursion);
  params.reso = parseInt(params.reso);
  params.seed = parseInt(params.seed);

  var table = [0];
  (0, _xorshift2.default)(params.seed);
  for (var i = 1; i < params.reso; i++) {
    table[i] = (0, _xorshift2.default)() * 2.0 - 1.0;
  }
  table.push(table[0]);

  var arr = [];
  for (var _i = 0; _i < params.length; _i++) {
    arr[_i] = 0.0;
    var prog = _i / params.length;
    for (var j = 0; j < params.recursion; j++) {
      var index = prog * params.freq * params.reso * Math.pow(2.0, j) % params.reso;
      var indexi = Math.floor(index);
      var indexf = index % 1.0;
      var amp = Math.pow(2.0, -j - 1.0);

      arr[_i] += amp * int(table[indexi], table[indexi + 1], indexf);
    }
  }

  return arr;
};

exports.default = genNoise;

},{"./xorshift":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/param.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _interpolator = require("./interpolator");

var _interpolator2 = _interopRequireDefault(_interpolator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cloneObj = function cloneObj(_obj) {
	if ((typeof _obj === "undefined" ? "undefined" : _typeof(_obj)) !== "object") {
		return _obj;
	}
	var obj = {};
	for (var key in _obj) {
		obj[key] = _obj[key];
	}
	return obj;
};

var AutomatonParam = function () {
	function AutomatonParam(_automaton) {
		_classCallCheck(this, AutomatonParam);

		var param = this;
		param.automaton = _automaton;

		param.values = [];
		var arrayLength = Math.ceil(param.automaton.resolution * param.automaton.length) + 1;
		for (var i = 0; i < arrayLength; i++) {
			param.values[i] = 0.0;
		}
		param.nodes = [];

		if (false) {} else {
			param.addNode(0.0, 0.0);
			param.addNode(param.automaton.length, 1.0);
		}

		param.render();
	}

	_createClass(AutomatonParam, [{
		key: "load",
		value: function load(_data) {
			var param = this;

			param.nodes = _data;

			param.render();
		}
	}, {
		key: "sortNodes",
		value: function sortNodes() {
			var param = this;

			param.nodes.sort(function (a, b) {
				return a.time - b.time;
			});
		}
	}, {
		key: "render",
		value: function render(_index) {
			var param = this;

			param.values = [];

			for (var i = 1; i < param.nodes.length; i++) {
				var startt = param.nodes[i - 1].time;
				var starti = Math.floor(startt * param.automaton.resolution);

				var endt = param.nodes[i].time;
				var endi = Math.floor(endt * param.automaton.resolution);

				var reset = i === 1 || param.nodes[i].mods[_interpolator2.default.MOD_RESET];
				var resetVel = param.nodes[i].mods[_interpolator2.default.MOD_RESET] ? param.nodes[i].mods[_interpolator2.default.MOD_RESET].velocity : 0.0;
				var deltaTime = 1.0 / param.automaton.resolution;

				var iparam = {
					mode: param.nodes[i].mode,
					start: reset ? param.nodes[i - 1].value : param.values[starti],
					end: param.nodes[i].value,
					deltaTime: deltaTime,
					length: endi - starti + 1,
					vel: !reset && 2 < param.values.length ? (param.values[param.values.length - 1] - param.values[param.values.length - 2]) / deltaTime : resetVel,
					mods: param.nodes[i].mods
				};
				for (var key in param.nodes[i].params) {
					iparam[key] = param.nodes[i].params[key];
				}

				var arr = _interpolator2.default.generate(iparam);
				param.values.pop();

				param.values = param.values.concat(arr);
			}
		}
	}, {
		key: "addNode",
		value: function addNode(_time, _value) {
			var param = this;

			var next = param.nodes.filter(function (node) {
				return _time < node.time;
			})[0];
			if (!next) {
				next = {
					mode: _interpolator2.default.MODE_LINEAR,
					params: {},
					mods: []
				};
				for (var i = 0; i < _interpolator2.default.MODS; i++) {
					next.mods[i] = false;
				}
			}

			var node = {
				time: _time,
				value: _value,
				mode: next.mode,
				params: cloneObj(next.params),
				mods: next.mods.map(function (_obj) {
					return cloneObj(_obj);
				})
			};
			param.nodes.push(node);

			param.sortNodes();
			param.render();

			return node;
		}
	}, {
		key: "setTime",
		value: function setTime(_index, _time) {
			var param = this;

			if (_index < 0 || param.nodes.length <= _index) {
				return;
			}

			if (_index !== 0 && param.nodes.length - 1 !== _index) {
				param.nodes[_index].time = Math.min(Math.max(_time, param.nodes[_index - 1].time + 1.0 / param.automaton.resolution), param.nodes[_index + 1].time - 1.0 / param.automaton.resolution);
				param.render();
			}

			return param.nodes[_index].time;
		}
	}, {
		key: "setValue",
		value: function setValue(_index, _value) {
			var param = this;

			if (_index < 0 || param.nodes.length <= _index) {
				return;
			}

			param.nodes[_index].value = _value;

			param.render();

			return param.nodes[_index].value;
		}
	}, {
		key: "setMode",
		value: function setMode(_index, _mode) {
			var param = this;

			if (_index < 1 || param.nodes.length <= _index) {
				return;
			}

			var node = param.nodes[_index];
			node.mode = _mode;
			if (_mode === _interpolator2.default.MODE_HOLD) {
				node.params = {};
			} else if (_mode === _interpolator2.default.MODE_LINEAR) {
				node.params = {};
			} else if (_mode === _interpolator2.default.MODE_SMOOTH) {
				node.params = {};
			} else if (_mode === _interpolator2.default.MODE_EXP) {
				node.params = {
					factor: 10.0
				};
			} else if (_mode === _interpolator2.default.MODE_SPRING) {
				node.params = {
					rate: 500.0,
					damp: 1.0
				};
			} else if (_mode === _interpolator2.default.MODE_GRAVITY) {
				node.params = {
					gravity: 70.0,
					bounce: 0.3
				};
			}

			param.render();
		}
	}, {
		key: "setParams",
		value: function setParams(_index, _params) {
			var param = this;

			if (_index < 0 || param.nodes.length <= _index) {
				return;
			}

			for (var key in _params) {
				param.nodes[_index].params[key] = _params[key];
			}

			param.render();
		}
	}, {
		key: "activeModParams",
		value: function activeModParams(_index, _mod, _active) {
			var param = this;

			if (_index < 0 || param.nodes.length <= _index) {
				return;
			}
			if (_mod < 0 || _interpolator2.default.MODS <= _mod) {
				return;
			}

			if (_active) {
				param.nodes[_index].mods[_mod] = {};

				var params = void 0;
				if (_mod === _interpolator2.default.MOD_RESET) {
					params = {
						velocity: 0.0
					};
				} else if (_mod === _interpolator2.default.MOD_SIN) {
					params = {
						freq: 5.0,
						amp: 0.1,
						phase: 0.0
					};
				} else if (_mod === _interpolator2.default.MOD_NOISE) {
					params = {
						freq: 1.0,
						amp: 0.2,
						reso: 8.0,
						recursion: 4.0,
						seed: 1.0
					};
				}
				param.setModParams(_index, _mod, params);
			} else {
				param.nodes[_index].mods[_mod] = false;
			}
		}
	}, {
		key: "setModParams",
		value: function setModParams(_index, _mod, _params) {
			var param = this;

			if (_index < 0 || param.nodes.length <= _index) {
				return;
			}
			if (_mod < 0 || _interpolator2.default.MODS <= _mod) {
				return;
			}

			for (var key in _params) {
				param.nodes[_index].mods[_mod][key] = _params[key];
			}

			param.render();
		}
	}, {
		key: "removeNode",
		value: function removeNode(_index) {
			var param = this;

			if (_index < 1 || param.nodes.length - 1 <= _index) {
				return;
			}

			var node = param.nodes.splice(_index, 1);

			param.render();

			return node;
		}
	}, {
		key: "getValue",
		value: function getValue(_time) {
			var param = this;

			var time = typeof _time === "number" ? _time : param.automaton.time;
			time = time % param.automaton.length;

			var index = time * param.automaton.resolution;
			var indexi = Math.floor(index);
			var indexf = index % 1.0;

			var pv = param.values[indexi];
			var fv = param.values[indexi + 1];

			return pv + (fv - pv) * indexf;
		}
	}]);

	return AutomatonParam;
}();

// ------

exports.default = AutomatonParam;

},{"./interpolator":"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/interpolator.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = void 0;
var xorshift = function xorshift(_seed) {
  seed = _seed || seed || 1;
  seed = seed ^ seed << 13;
  seed = seed ^ seed >>> 17;
  seed = seed ^ seed << 5;
  return seed / Math.pow(2, 32) + 0.5;
};

exports.default = xorshift;

},{}]},{},["/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/script/main.js"]);
