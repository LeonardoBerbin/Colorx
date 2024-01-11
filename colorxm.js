const Colorx = (function(){
	const 
	DomModule = (function(){
		let container = null, 
		BUILD_COMPONENTS = (component, parent, options) => {
			if(component.permission && !component.permission(options)) return; 
			component.preload && component.preload(component, options); 
			const 
			element = document.createElement(component.type),
			numberOfChildren = component.children ? (component?.repeatChildren ?? 1) : 0; 
			Object.assign(element, component?.target ?? {}); 
			Object.assign(element.style, component?.style ?? {}); 
			parent.appendChild(element); 
			for(let number = 0; number < numberOfChildren; number += 1){
				component.children
						 .forEach(child => BUILD_COMPONENTS(child, element, options)); 
			}; 
			component.load && component.load(element, options); 
		}
		const components = [
			{
				type: "div", 
				target: {classList: ["clx-format-viewer"]},
				children: [
					{
						type: "select", 
						target: {
							title: "select-format", 
							classList: ["clx-select-format"],
							onchange: (event) => FormatModule.value = event.target.value
						},
						children: [],
						preload: (component) => {
							for(format in FormatModule.avaibled){
								component
									.children
									.push({ 
										type: "option", 
										target: {
											classList: [`clx-format-option clx-${format}-option`], 
											innerText: format
										} 
									}); 
							}; 
						}, 
						load: (element) => FormatModule.select = element, 
					}, 
					{
						type: "input", 
						target: {
							type: "text", 
							status: "output", 
							classList: ["clx-input-format"], 
							oninput: (event) => {
								event.target.status = "input"; 
								FormatModule.value = event.target.value; 
							}, 
							onchange: (event) => {
								event.target.status = "output"; 
								event.target.value = ColorModule.value[FormatModule.value]; 
								ListsModule._ADD("history"); 
							}}, 
						load: (element) => FormatModule.input = element 
					}
				],
				permission: (options) => options.showFormatViewer,
			}, 
			{
				type: "div", 
				target: {classList: ["clx-preview clx-viewer-color"]}, 
				load: (element) => ColorModule.preview = DomModule._CREATE_VIEWER(element),
				permission: (options) => options.showPreview
			}, 
			{
				type: "div", 
				target: {
					classList: ["clx-history-list"],
					innerText: "history"
				}, 
				children: [
					{
						type: "button", 
						target: {classList: ["clx-history-viewer clx-viewer-color"], 
								 onclick: (event) => {
									ColorModule.value = event.target.style.backgroundColor; 
									ListsModule._ADD("history"); 
								 }},
						load: (element) => ListsModule.history.push(DomModule._CREATE_VIEWER(element))
					}
				], 
				permission: (options) => options.lastestColorsList > 0,  
				preload: (component, options) => {
					component.repeatChildren = options.lastestColorsList; 
					ListsModule._CREATE("history"); 
				},
				load: () => ListsModule._CLEAR("history") 
			}, 
			{
				type: "div", 
				target: {classList: ["clx-favorite-list"], 
						 innerText: "favorite"}, 
				children: [
					{
						type: "button", 
						target: {
							classList: ["clx-add-favorite"], 
							innerText: "add", 
							onclick: () => ListsModule._ADD("favorites")
						}
					}, 
					{
						type: "button", 
						target: {
							classList: ["clx-clear-favorite-list"], 
							innerText: "clear",
							onclick: () => ListsModule._CLEAR("favorites")
						}
					}
				],
				permission: (options) => options.favoriteColorsList > 0,
				preload: (component, options) => {
					ListsModule._CREATE("favorites"); 
					for(let i = 0; i < options.favoriteColorsList; i += 1){
						component.children
								 .push(
									{
										type: "button", 
										target: {
											classList: ["clx-favorite-viewer clx-viewer-color"],
										 	onclick: (event) => {
												ColorModule.value = event.target.style.backgroundColor; 
												ListsModule._ADD("history"); 
										 }}, 
										load: (element) => ListsModule.favorites.push(DomModule._CREATE_VIEWER(element))
									}
						)
					}; 
				}, 
				load: () => ListsModule._CLEAR("favorites")
			}, 
			{
				type: "div", 
				target: {classList: ["clx-main-view"]},
				children: [
					{
						type: "div", 
						target: {
							classList: ["clx-spectrum-viewer"]
						}, 
						children: [
							{
								type: "div", 
								target: {
									classList: ["clx-clasic-spectrum clx-spectrum"]
								},
								load: (element) => {
									const container = DomModule._CREATE_VIEWER(element); 
									SpectrumsModule.clasic.property = DomModule._CREATE_SPECTRUM_VIEWER(container); 
								}, 
								permission: (options) => options.showClasicSpectrum
							},
							{
								type: "div", 
								target: {
									classList: ["clx-slider clx-hue-control"]
								}, 
								load: (element) => DomModule._CREATE_SLIDER(element, "hue")
							}
						], 
						preload: () => ColorModule.spectrumList = []
					}
				]
			},
			{
				type: "div", 
				target: {
					classList: ["clx-swatches"],
					innerText: "swatches"
				}, 
				children: [], 
				preload: (component, options) => {
					ListsModule._CREATE("swatches"); 
					options.swatches.forEach(color => {
						component.children
						         .push(
									{
										type: "button", 
										target: {
											classList: ["clx-swatches-viewer clx-viewer-color"], 
										 	onclick: (event) => {
												ColorModule.value = event.target.style.backgroundColor; 
												ListsModule._ADD("history"); 
										 	}
										}, 
										load: (element) => {; 
											ColorModule.value = color; 
											ListsModule.swatches.push(DomModule._CREATE_VIEWER(element)); 
											ListsModule._ADD("swatches"); 
										}
									}
								); 
					}); 
				}, 
				permission: (o) => (o?.swatches ?? dataset._RECORDS.swatches.value).length > 0,
			}
		]; 
		return {
			get container(){return container}, 
			set container(options){
				if(container !== null) return; 
				if(options.el) container = document.querySelector(options.el)
				else{
					container = document.createElement("div"); 
					document.body.appendChild(this.container);
				} 
				container.classList = ["clx-container"]; 
				components.forEach(component => BUILD_COMPONENTS(component, this.container, options));
				BUILD_COMPONENTS = null; 
			}, 
			_CREATE_VIEWER(element){
				const 
				style = {
					width: "100%", 
					height: "100%",
					position: "absolute", 
					top: 0, 
					left: 0
				},
				background = document.createElement("canvas"), 
				fill = document.createElement("div"); 
				Object.assign(background.style, {...style, pointerEvents: "none"}); 
				Object.assign(fill.style, style); 
				background.width = background.height = 400
				const 
				context = background.getContext("2d"), 
				size = parseFloat(getComputedStyle(element).width) >= 100 ? 10 : 100; 
				for(let row = 0; row < background.width/size; row++){
					for(let column = 0; column < background.width/size; column++){
						const 
						x = column * size, 
						y = row * size, 
						isEvenSquare = (row + column) % 2 === 0;
						context.fillStyle = isEvenSquare ? "#FFFFFF15" : "#00000030"; 
						context.fillRect(x, y, size, size); 
					}; 
				}; 
				element.style.position = "relative";
				element.appendChild(background); 
				element.appendChild(fill);
				return fill; 
			},
			_CREATE_SPECTRUM_VIEWER(element){
				const 
				canvas = document.createElement("canvas"), 
				context = canvas.getContext("2d", {willReadFrequently: true}), 
				thumb = document.createElement("button"); 
				Object.assign(thumb.style, {position: "absolute"});  
				Object.assign(canvas.style, {width: "100%", height: "100%"}); 
				canvas.width = canvas.height = 500; 
				element.appendChild(canvas); 
				element.appendChild(thumb);
				return {canvas, context, thumb}; 
			}, 
			_CREATE_SLIDER(element, ref){
				const thumb = document.createElement("div"); 
				Object.assign(thumb.style, {position: "absolute", pointerEvents: "none"}); 
				element.style.position = "relative"; 
				element.value = 0; 
				element.reference = ref; 
				element.appendChild(thumb); 
				SlidersModule.sliders = element; 
			}
		}
	})(), 
	ColorModule = (function(){
		let value = null;
		const
		canvas = document.createElement("canvas"), 
		context = canvas.getContext("2d", {willReadFrequently: true}); 
		canvas.width = canvas.height = 1; 
		return {
			get value(){return value}, 
			set value(data){
				const 
				values = this._GET_HSL(this._GET_RGBA(data)),
				{red, green, blue, hue, saturation, luminosity, alpha} = values, 
				rgb = `rgb${alpha < 1 ? "a" : ""}(${red}, ${green}, ${blue}${alpha < 1 ? ", " + alpha.toFixed(1) : ""})`, 
				hex = ('#' + ((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1) + (alpha < 1 ? Math.round(alpha * 255).toString(16) : "")).toUpperCase(), 
				hsl = `hsl${alpha < 1 ? "a" : ""}(${hue}, ${saturation}%, ${luminosity}%${alpha < 1 ? ", " + alpha.toFixed(1) : ""})`; 
				value = {rgb, hex,hsl, values}; 
				this.spectrumList ? this.spectrumList.forEach(spectrum => spectrum.status === "output" && spectrum._DRAW()) : null; 
				this.preview ? this.preview.style.backgroundColor = rgb : null;
				FormatModule?.input.status === "output" ? FormatModule.input.value = this.value[FormatModule.value] : null;   
			}, 
			_GET_RGBA(color){
				console.log(color)
				context.clearRect(0, 0, 1, 1); 
				context.fillStyle = color; 
				context.fillRect(0, 0, canvas.width, canvas.height); 
				let [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data; 
				alpha /= 255; 
				return {red, green, blue, alpha}; 
			}, 
			_GET_HSL(object){
				const 
				{red, green, blue} = object, 
				r = red/255, g = green/255, b = blue/255, 
				max = Math.max(r, g, b), min = Math.min(r, g, b); 
				let hue, saturation, luminosity = (max + min)/2; 
				if(max === min) hue = saturation = 0; 
				else{
					const d = max - min; 
					saturation = d/(luminosity > 0.5 ? (2 - d) : (max + min)); 
					hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; 
					hue /= 6; 
				}; 
				hue = Math.round(hue * 360); saturation = Math.round(saturation * 100); luminosity = Math.round(luminosity * 100); 
				return {...object, hue, saturation, luminosity}; 
			}
		}
	})(), 
	FormatModule = (function(){
		let value = "hex"; 
		const avaibled = {
			hex: /^#([0-9A-Fa-f]{3}){1,2}$|^#([0-9A-Fa-f]{8})$/,
			rgb: /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/, 
			hsl: /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/
		}; 
		return {
			get avaibled(){return avaibled}, 
			get value(){return value}, 
			set value(data){
				const string = data.toLowerCase(); 
				if(this.input.status === "input"){
					value = /^#|^hex/.test(string) ? "hex" : /^rgba?/.test(string) ? "rgb" : /^hsla?/.test(string) ? "hsl" : this.value; 
					/^hex/.test(string) && (this.input.value = "#"); 
					this.select.value = this.value; 
					this.avaibled[this.value].test(string) && (ColorModule.value = string); 
					return 
				}; 
				value = string; 
				this.input.value = ColorModule.value[this.value]; 
			}
		}
	})(), 
	ListsModule = (function(){
		const list = {}; 
		return {
			_CREATE(name){
				list[name] = []; 
				this[name] = []; 
			}, 
			_ADD(name){
				list[name] = list[name].filter(data => {return data.rgb !== ColorModule.value.rgb});
				list[name].unshift(ColorModule.value);
				while(list[name].length >  this[name].length) 
				list[name].pop(); 
				list[name].forEach((data, index) => this[name][index].style.backgroundColor = data.rgb); 
			}, 
			_CLEAR(name){
				while(list[name].length > 0)
				list[name].pop(); 
				this[name].forEach(element => element.style.backgroundColor = "transparent"); 
			}
		};
	})(), 
	SlidersModule = (function(){
		const sliders = []; 
		return {
			get sliders(){return sliders}, 
			set sliders(element){
				switch(element.reference){
					case "hue": 
						element.max = 360; 
						let gradient = ""
						for(let hue = 0; hue <= 360; hue += 10){
							gradient += `,hsl(${hue}, 100%, 50%)`; 
						}; 
						element.style.background = `linear-gradient(90deg ${gradient})`;
						break; 
					case "luminosity": 
					case "saturation": 
						element.max = 100; 
						break; 
					default: 
						element.max = 255; 
						break
				}
				element.addEventListener("mousedown", (event) => this._DRAG(event, element)); 
				sliders.push(element); 
			},
			_DRAG(event, element){
				const 
				start = (event) => {
					const 
					thumb = element.children[0], 
					rect = element.getBoundingClientRect(),
					x = event.clientX - rect.left - thumb.clientWidth/2, 
					maxX = element.clientWidth - thumb.clientWidth/2, 
					boundedX = Math.min(Math.max(-thumb.clientWidth/2, x), maxX); 
					thumb.style.left =  boundedX + "px"; 
					element.value = (boundedX + thumb.clientWidth/2) * parseFloat(element.max)/element.clientWidth
					const {red, green, blue, hue, saturation, luminosity, alpha} = ColorModule.value.values; 	
					switch(element.reference){
						case "hue": 
						ColorModule.value = `hsla(${element.value}, ${saturation}%, ${luminosity}%, ${alpha})`; 
						break; 
					};  
				}, 
				stop = () => {
					document.removeEventListener("mousemove", start); 
					document.removeEventListener("mouseup", stop); 
					document.removeEventListener("touchmove", (event) => start(event.touches[0])); 
					document.removeEventListener("touchend", stop); 
				}
				
				start(event)
				document.addEventListener("mousemove", start);
				document.addEventListener("mouseup", stop); 
				document.addEventListener("touchmove", (event) => start(event.touches[0])); 
				document.addEventListener("touchend", stop); 
			}
		}; 
	})(),
	SpectrumsModule = (function(){
		return {
			clasic: {
				get property(){return this}, 
				set property(object){
					SpectrumsModule._SET_PROPERTY(this, object); 
					[this.thumb, this.canvas].forEach(element => {
						const run = (event) => SpectrumsModule._READ_CANVAS(event, this, this._MOVE_THUMB);
						element.addEventListener("mousedown", run); 
						element.addEventListener("touchstart", run); 
					}); 
					this.status = "output"; 
				},  
				_DRAW(){
					const
					{hue, alpha} = ColorModule.value.values,
					fill = `hsl(${hue}, 100%, 50%)`; 
					const a = this.context.createLinearGradient(0, 0, 500, 0);  
					a.addColorStop(0, "hsla(0, 0%, 100%, 1)"); 
					a.addColorStop(.01, "hsla(0, 0%, 100%, 1)"); 
					a.addColorStop(1, "hsla(0, 0%, 100%, 0)"); 
					const b = this.context.createLinearGradient(0, 500, 0, 0);
					b.addColorStop(0, "hsla(0, 0%, 0%, 1)"); 
					b.addColorStop(1, "hsla(0, 0%, 0%, 0)"); 
					[fill, a, b].forEach(gradient => {
						this.context.fillStyle = gradient; 
						this.context.fillRect(0, 0, 500, 500); 
					}); 
					this.canvas.style.opacity = alpha; 
					SpectrumsModule._PUT_THUMB(this); 
				}, 
				_MOVE_THUMB(event, thumb){
					const 
					container = thumb.parentElement, 
					rect = container.getBoundingClientRect(), 
					x = event.clientX - rect.left - thumb.clientWidth/2, 
					y = event.clientY - rect.top - thumb.clientHeight/2, 
					maxX = container.clientWidth - thumb.clientWidth/2, 
					maxY = container.clientHeight - thumb.clientHeight/2, 
					boundedX = Math.min(Math.max(-thumb.clientWidth/2, x), maxX), 
					boundedY = Math.min(Math.max(-thumb.clientHeight/2, y), maxY); 
					thumb.style.left = boundedX + "px"; 
					thumb.style.top = boundedY + "px"; 
					return {x: boundedX, y: boundedY}; 
 				}
					
			}, 
			_SET_PROPERTY(spectrum, object){
				const {canvas, context, thumb} = spectrum; 
				if(canvas && context && thumb) return; 
				Object.assign(spectrum, object); 
				ColorModule.spectrumList.push(spectrum); 
			}, 
			_READ_CANVAS(event, spectrum, move){
				const 
				drag = (event) => {
					const 
					client = event.touches?.[0] ?? event, 
					{thumb, context, canvas} = spectrum, 
					{x, y} = move(client, thumb), 
					dx = (x + thumb.clientWidth/2) * 499/canvas.clientWidth, 
					dy = (y + thumb.clientHeight/2) * 499/canvas.clientHeight, 
					[red, green, blue] = context.getImageData(dx, dy, 1, 1).data, 
					rgb = `rgba(${red}, ${green}, ${blue}, ${ColorModule.value.values.alpha})`; 
					spectrum.status = "input"; 
					ColorModule.value = rgb; 
					thumb.style.borderColor = `rgb(${Math.abs(red - 255)}, ${Math.abs(green - 255)}, ${Math.abs(blue - 255)})`; 
				}, 
				stop = () => {
					spectrum.status = "output"; 
					ListsModule._ADD("history"); 
					document.removeEventListener("mousemove", drag); 
					document.removeEventListener("mouseup", stop)
					document.removeEventListener("touchmove", drag); 
					document.removeEventListener("touchend", stop); 
				} 
				drag(event); 
				document.addEventListener("mousemove", drag); 
				document.addEventListener("mouseup", stop); 
				document.addEventListener("touchmove", drag); 
				document.addEventListener("touchend", stop); 
			}, 
			_PUT_THUMB(spectrum){
				const 
				{red, green, blue} = ColorModule.value.values,
				{context, canvas, thumb} = spectrum, 
				rgba = [red, green, blue, 255], 
				data = context.getImageData(0, 0, 500, 500).data; 
				let x = y = null; 
				for(let i = 0; i < data.length; i +=4){
					const pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];
					if(pixel.every((value, index) => value === rgba[index])){
						x = (i / 4) % 500 ; 
						y = Math.floor(i / 4 / 500); 
					};  
				}; 
				x = (x * canvas.clientWidth)/499 - thumb.clientWidth/2; 
				y = (y * canvas.clientHeight)/499 - thumb.clientHeight/2; 
				thumb.style.left = x ? x  + "px" : thumb.style.left;
				thumb.style.top = y ? y  + "px" : thumb.style.top; 
				thumb.style.borderColor = `rgb(${Math.abs(red - 255)}, ${Math.abs(green - 255)}, ${Math.abs(blue - 255)})`; 
			},
		}; 
	})(); 
	return class {
		static create = o => new Colorx(o); 
		static _default = {
			defaultColor: "red", 
			swatches: ["#FF000080", "#00FF00", "#0000FF", "#FFFF00", "#800080", "#40E0D0", "#87CEEB", "#333333", "#FFF000", "#8080FF"], 
			showFormatViewer: true, 
			showPreview: true, 
			showClasicSpectrum: true, 
			lastestColorsList: 10, 
			favoriteColorsList: 8, 
			spectrum: "clasic"
		}
		constructor(o){
			this.options = Object.assign({...Colorx._default}, o); 
			DomModule.container = this.options; 
			ColorModule.value = this.options.defaultColor; 
		}
	}
})();                     