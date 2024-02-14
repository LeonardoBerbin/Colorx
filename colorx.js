const Colorx = (function () {
    const createViewer = () => {
        const element = document.createElement('div');
        const canvas = document.createElement('canvas');
        const fill = document.createElement('div');

        const basicStyles = {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0
        };

        Object.assign(canvas.style, { ...basicStyles, pointerEvents: "none" });
        Object.assign(fill.style, basicStyles);
        
        canvas.width = 400;
        canvas.height = 400;

        const context = canvas.getContext("2d");
        const size = 100;
        for (let row = 0; row < canvas.width / size; row++) {
            for (let column = 0; column < canvas.width / size; column++) {
                const x = column * size;
                const y = row * size;
                const isEvenSquare = (row + column) % 2 === 0;
                context.fillStyle = isEvenSquare ? "#FFFFFF40" : "#00000040";
                context.fillRect(x, y, size, size);
            }
        }

        element.style.position = "relative";
        element.appendChild(canvas);
        element.appendChild(fill);
        return { element, fill, canvas };
    };
    
    const createSlider = () => {
        const element = document.createElement('div');
        const fill = document.createElement('div');
        const thumb = document.createElement('button');
        
        element.style.position = 'relative';
        thumb.style.position = 'absolute';
        
        element.appendChild(fill);
        element.appendChild(thumb);
        
        const callbacks = [];
        
        const drag = (event) => {
            event.preventDefault();
            
            const start = (event) => {
                const touches = event.touches || [];
                
                const e = touches?.[0] ?? event;
                const rect = element.getBoundingClientRect();
                
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const maxX = element.clientWidth - thumb.offsetWidth;
                const maxY = element.clientHeight - thumb.offsetHeight;
                
                const boundedX = Math.min(Math.max(0, x), maxX);
                const boundedY = Math.min(Math.max(0, y), maxY);
                
                thumb.style.left = boundedX + "px";
                thumb.style.top = boundedY + "px";
                
                callbacks.forEach(e => e(boundedX * 100/maxX, boundedY * 100/maxY));
            };
            
            const end = () => {
                document.removeEventListener('touchmove', start);
                document.removeEventListener('touchend', end);
                document.removeEventListener('mousemove', start);
                document.removeEventListener('mouseup', end);
            };
            
            document.addEventListener('touchmove', start);
            document.addEventListener('touchend', end);
            document.addEventListener('mousemove', start);
            document.addEventListener('mouseup', end);
        };
        
        thumb.addEventListener('touchstart', drag);
        element.addEventListener('touchstart', drag);
            
        thumb.addEventListener('mousedown', drag);
        element.addEventListener('mousedown', drag);
        
        return { 
            element, 
            fill, 
            thumb,
            isDrag: (callback) => {
                callbacks.push(callback)
            }
        };
    };
    
    const createListColors = (number, changes, ColorModule) => {
        const component = document.createElement('div');
        component.className = 'clx-list-color';
        
        const viewers = [];
        
        for(let i = 0; i < number; i += 1){
            const viewer = createViewer();
            viewer.element.className = 'clx-preview';
            
            viewer.element.addEventListener('touchstart', () => {
                ColorModule.value = getComputedStyle(viewer.fill).backgroundColor;
                changes.forEach(e => e(ColorModule.value));
            });
            
            viewer.element.addEventListener('mousedown', () => {
                ColorModule.value = getComputedStyle(viewer.fill).backgroundColor;
                changes.forEach(e => e(ColorModule.value));
            });
            
            viewers.push(viewer.fill);
            component.appendChild(viewer.element);
        };
        
        return {component, viewers};
    };
    
    const createClasicSpectrum = (changes, sliderRegister, ColorModule) => {
        const {element, fill, thumb, isDrag} = createSlider();
        const spectrum = document.createElement('canvas');
        const hueControl = createSlider();
        
        element.classList = thumb.classList = [];
        element.classList.add('clx-spectrum') 
        element.classList.add('clx-clasic-spectrum');
        
        spectrum.style.width = spectrum.style.height = '100%';
        spectrum.width = spectrum.height = 500;
        
        thumb.style.minHeight = thumb.style.minWidth = '5%';
        thumb.classList.add('clx-spectrum-thumb');
        thumb.classList.add('clx-clasic-spectrum-thumb');
        
        element.insertBefore(spectrum, fill);
        element.removeChild(fill);
        
        const context = spectrum.getContext('2d', {willReadFrequenly: true});
        
        const draw = (hue) => {
            context.save();
            context.clearRect(0, 0, 500, 500);
            
            const a = `hsl(${hue}, 100%, 50%)`;
					              
            const b = context.createLinearGradient(0, 0, 500, 0);
            b.addColorStop(0, "hsla(0, 0%, 100%, 1)");
            b.addColorStop(.01, "hsla(0, 0%, 100%, 1)");
            b.addColorStop(1, "hsla(0, 0%, 100%, 0)");
                
            const c = context.createLinearGradient(0, 500, 0, 0);
            c.addColorStop(0, "hsla(0, 0%, 0%, 1)");
            c.addColorStop(1, "hsla(0, 0%, 0%, 0)");
                
            [a, b, c].forEach(gradient => {
                context.fillStyle = gradient;
                context.fillRect(0, 0, 500, 500);
            });
        };
        
        draw(0);
        
        const readSpectrum = (x, y) => {
            let dx = Math.round(x * 5);
            let dy = Math.round(y * 5);
            
            dx -= dx > 499 ? 1 : 0;
            dx -= dx > 499 ? 1 : 0;
                
            const [red, green, blue] = context.getImageData(dx, dy, 1, 1).data;
                
            if(ColorModule.value.values.alpha)
            ColorModule.value = `rgba(${red}, ${green}, ${blue}, ${ColorModule.value.values.alpha})`;
            
            callbacks.forEach(e => e({
                valueX: dx,
                valueY: dy,
                x: thumb.getBoundingClientRect().left,
                y: thumb.getBoundingClientRect().top
            },ColorModule.value));
        };
        
        let status = 'output';
        const callbacks = [];
        
        element.addEventListener('touchmove', (event) => event.preventDefault());
        element.addEventListener('mousemove', (event) => event.preventDefault());
        
        isDrag((x, y) => {
            status = 'input';
            thumb.style.transition = 'none';
            
            readSpectrum(x, y);
            thumb.style.left = `calc(${x}% - ${thumb.offsetWidth/2}px)`;
            thumb.style.top = `calc(${y}% - ${thumb.offsetHeight/2}px)`;
        });
        
        element.addEventListener('touchend', () => {
            status = 'output';
            changes.forEach(e => e(ColorModule.value));
        });
        
        element.addEventListener('mouseup', () => {
            status = 'output';
            changes.forEach(e => e(ColorModule.value));
        });
        
        const slider = createSlider();
        slider.element.classList.add('clx-hue-control');
        slider.element.classList.add('clx-clasic-hue-control');
        
        slider.isDrag((x, y) => {
            status = 'input';
            slider.thumb.style.transition = 'none';
            
            const value = x | y;
            draw(value * 3.6);
            
            const {luminosity, saturation, alpha} = ColorModule.value.values;
            
            if(alpha);
            ColorModule.value = `hsla(${value * 3.6}, ${saturation}%, ${luminosity}%, ${alpha})`;
            
            sliderRegister.forEach(e => e({
                name: 'hue control',
                value: x | y,
                x: slider.thumb.getBoundingClientRect().left,
                y: slider.thumb.getBoundingClientRect().top
            }, ColorModule.value));
        });
        
        slider.element.addEventListener('touchend', () => {
            status = 'output';
            changes.forEach(e => e(ColorModule.value));
        });
        
        slider.element.addEventListener('mouseup', () => {
            status = 'output';
            changes.forEach(e => e(ColorModule.value));
        });
        
        const component = document.createElement('div');
        
        component.classList.add('clx-spectrum-component');
        component.classList.add('clx-clasic-spectrum-component');
        
        component.appendChild(element);
        component.appendChild(slider.element);
        
        return {
            callbacks,
            draw,
            component,
            spectrumElement: element,
            slider: slider.element, 
            sinchronize: () => {
                thumb.style.transition = slider.thumb.style.transition = 'left .5s, top .5s';
        
                const {red, green, blue} = ColorModule.value.values;
                const rgba = [red, green, blue, 255];
                const data = context.getImageData(0, 0, 500, 500).data;
                
                let nearestX, nearestY;
    
                for (let i = 0; i < data.length; i += 4) {
                    const pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    const distance = Math.sqrt(
                       (pixel[0] - rgba[0]) ** 2 +
                       (pixel[1] - rgba[1]) ** 2 +
                       (pixel[2] - rgba[2]) ** 2
                    );
        
                    if (distance <= 2) {
                        nearestX = (i / 4) % 500;
                        nearestY = Math.floor(i / 4 / 500);
                    };
                };
                
                const x = Math.round(nearestX * 100 / 500);
                const y = Math.round(nearestY * 100 / 500);
                
                thumb.style.left = `calc(${x}% - ${thumb.offsetWidth / 2}px)`;
                thumb.style.top = `calc(${y}% - ${thumb.offsetHeight / 2}px)`;
                
                const {hue} = ColorModule.value.values;
                const value = hue * 100 / 360;
                
                slider.thumb.style.left = value * (slider.element.clientWidth - slider.thumb.offsetWidth) / 100 + 'px';
                slider.thumb.style.top = value * (slider.element.clientHeight - slider.thumb.offsetHeight) / 100 + 'px';
            },
            get status(){ return status }
        };
    };
    
    const createCircleSpectrum = (changes, sliderRegister, ColorModule) => {
        const component = document.createElement('div');
        
        const slider = document.createElement('div');
        const sliderThumb = document.createElement('button');
        
        const spectrumElement = document.createElement('div');
        const spectrum = document.createElement('canvas');
        const spectrumThumb = document.createElement('button');
        
        spectrumElement.classList.add('clx-spectrum');
        spectrumElement.classList.add('clx-circle-spectrum');
        
        Object.assign(spectrumElement.style, {
            width: '75%',
            height: '75%',
            position: 'absolute',
            borderRadius: '50%',
            top: '12.5%',
            left: '12.5%',
        });
        
        spectrum.width = spectrum.height = 500;
        Object.assign(spectrum.style, {
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        });
        
        spectrumThumb.classList.add('clx-spectrum-thumb');
        spectrumThumb.classList.add('clx-circle-spectrum-thumb');
        
        Object.assign(spectrumThumb.style, {
            minWidth: '7.5%',
            minHeight: '7.5%',
            position: 'absolute',
            top: '15%',
            left: '78.5%'
        });
        
        spectrumElement.appendChild(spectrum);
        spectrumElement.appendChild(spectrumThumb);
        
        component.classList.add('clx-spectrum-component');
        component.classList.add('clx-circle-spectrum-component');
        
        Object.assign(component.style, {
            position: 'relative',
            height: 'auto',
            paddingTop: '94%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 
            `conic-gradient(
                hsl(0,100%,50%), 
                hsl(45, 100%, 50%),
                hsl(90, 100%, 50%),
                hsl(135, 100%, 50%),
                hsl(180, 100%, 50%),
                hsl(225, 100%, 50%),
                hsl(270, 100%, 50%),
                hsl(315, 100%, 50%),
                hsl(360, 100%, 50%)
             )`
        });
        
        slider.classList.add('clx-hue-control');
        slider.classList.add('clx-circle-hue-control');
        
        Object.assign(slider.style, {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        });
        
        Object.assign(sliderThumb.style, {
            width: '11.5%',
            height: '11.5%',
            borderRadius: '50%',
            position: 'absolute',
            top: '.5%',
            left: '50%'
        });
        
        slider.appendChild(sliderThumb);
        
        component.appendChild(slider);
        component.appendChild(spectrumElement);
        
        const context = spectrum.getContext('2d', {willReadFrequenly: true});
        const draw = (hue) => {
            const a = `hsl(${hue}, 100%, 50%)`;
            
            const b = context.createLinearGradient(0, 0, 500, 0);
            b.addColorStop(0, "hsla(0, 0%, 100%, 1)");
            b.addColorStop(.1, "hsla(0, 0%, 100%, 1)");
            b.addColorStop(.8, "hsla(0, 0%, 100%, 0)");
                
            const c = context.createLinearGradient(0, 500, 0, 0);
            c.addColorStop(0, "hsla(0, 0%, 0%, 1)");
            c.addColorStop(.1, "hsla(0, 0%, 0%, 1)");
            c.addColorStop(.8, "hsla(0, 0%, 0%, 0)");
            
            context.save(); // Guarda el estado actual del contexto
            // Limpiar el canvas
            context.clearRect(0, 0, spectrum.width, spectrum.height);
            
            // Definir el recorte circular
            context.beginPath();
            context.arc(spectrum.width * 0.5, spectrum.height * 0.5, spectrum.width * 0.5, 0, Math.PI * 2);
            context.closePath();
            context.clip();
            
            // Dibuja los gradientes lineales dentro del área recortada
            [a, b, c].forEach(gradient => {
                context.fillStyle = gradient;
                context.fillRect(0, 0, spectrum.width, spectrum.height);
            });
            
            context.restore(); // Restaura el estado del contexto
        };
        
        draw(0);
        
        let status = 'output';
        const callbacks = [];
        
        const sliderDrag = (event) => {
            event.preventDefault();
            status = 'input';
            slider.style.transition = 'none';
            
            const touch = event.touches || [];
            const e = touch?.[0] ?? event;
            
            const rect = component.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Calcular el ángulo de rotación
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            // Aplicar la rotación al slider
            slider.style.transform = `rotate(${angle + 90}deg)`;
            
            const hue = Math.round(((angle - 270) % 360) + 360);
            
            const {saturation, luminosity, alpha} = ColorModule.value.values;
            if(alpha) ColorModule.value = `hsla(${hue},${saturation}%,${luminosity}%,${alpha})`;
            
            draw(hue);
            
            sliderRegister.forEach(e => e({
                name: 'hue control',
                value: hue * 100/360,
                x: sliderThumb.getBoundingClientRect().left,
                y: sliderThumb.getBoundingClientRect().top
            }, ColorModule.value));
        };
        
        slider.addEventListener("touchmove", sliderDrag);
        slider.addEventListener("mousemove", sliderDrag);
        
        const spectrumDrag = (event) => {
            event.preventDefault();
            status = 'input';
            spectrumThumb.style.transition = 'none';
            
            const touches = event.touches;
            const e = touches?.[0] ?? event;
            
            const rect = spectrum.getBoundingClientRect();
            
            const centerX = (spectrum.offsetWidth - spectrumThumb.offsetWidth) / 2;
            const centerY = (spectrum.offsetHeight - spectrumThumb.offsetHeight) / 2;
            
            // Calcula la posición del cursor con respecto al centro del círculo
            const relX = e.clientX - rect.left - centerX;
            const relY = e.clientY - rect.top - centerY;
            
            // Calcula el ángulo entre el cursor y el centro del círculo
            let angle = Math.atan2(relY, relX);
            
            // Calcula la distancia desde el centro del círculo hasta el cursor
            const distance = Math.sqrt(relX ** 2 + relY ** 2);
            
            // Limita la distancia para asegurarse de que el cursor esté dentro del círculo
            const maxDistance = Math.min(centerX, centerY);
            const clampedDistance = Math.min(distance, maxDistance);
            
            // Calcula las coordenadas del punto donde se colocará el thumb dentro del círculo
            const thumbX = centerX + clampedDistance * Math.cos(angle);
            const thumbY = centerY + clampedDistance * Math.sin(angle);
            
            // Actualiza las coordenadas del div
            spectrumThumb.style.left = thumbX + "px";
            spectrumThumb.style.top = thumbY + "px";
            
            let dx = thumbX * 500 / spectrum.offsetWidth;
            let dy = thumbY * 500 / spectrum.offsetHeight;
            
            dx = dx <= 249 ? Math.ceil(dx) + 5 : Math.floor(dx);
            dy = dy <= 249 ? Math.ceil(dy) + 5 : Math.floor(dy);
                
            const [red, green, blue] = context.getImageData(dx, dy, 1, 1).data;
                
            if(ColorModule.value.values.alpha)
            ColorModule.value = `rgba(${red}, ${green}, ${blue}, ${ColorModule.value.values.alpha})`;
            
            callbacks.forEach(e => e({
                valueX: dx,
                valueY: dy,
                x: spectrumThumb.getBoundingClientRect().left,
                y: spectrumThumb.getBoundingClientRect().top
            }, ColorModule.value));
        };
        
        spectrumElement.addEventListener('touchmove', (event) => spectrumDrag(event));
        spectrumElement.addEventListener('mousemove', (event) => spectrumDrag(event));
        
        component.addEventListener('touchend', (event) => {
            status = 'output';
            changes.forEach(e => e(ColorModule.value));
        });
        
        component.addEventListener('mouseup', (event) => {
            status = 'output';
            changes.forEach(e => e(ColorModule.value));
        });
        
        return {
            callbacks,
            component,
            spectrumElement,
            slider,
            draw,
            sinchronize: () => {
                slider.style.transition = 'transform 1s';
                spectrumThumb.style.transition = 'left .5s, top .5s';
        
                const {red, green, blue} = ColorModule.value.values;
                const rgba = [red, green, blue, 255];
                const data = context.getImageData(0, 0, 500, 500).data;
                
                let nearestX, nearestY;
    
                for (let i = 0; i < data.length; i += 4) {
                    const pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    const distance = Math.sqrt(
                       (pixel[0] - rgba[0]) ** 2 +
                       (pixel[1] - rgba[1]) ** 2 +
                       (pixel[2] - rgba[2]) ** 2 +
                       (pixel[3] - rgba[3]) ** 2
                    );
        
                    if (distance <= 2) {
                        nearestX = (i / 4) % 500;
                        nearestY = Math.floor(i / 4 / 500);
                    };
                };
                
                const rect = spectrum.getBoundingClientRect();
                
                const x = Math.round(nearestX * 100 / 500) * (spectrum.offsetWidth - spectrumThumb.offsetWidth) / 100;
                const y = Math.round(nearestY * 100 / 500) * (spectrum.offsetHeight - spectrumThumb.offsetHeight) / 100;
                
                spectrumThumb.style.left = x + 'px';
                spectrumThumb.style.top = y + 'px';
                
                
                const {hue} = ColorModule.value.values;
                slider.style.transform = `rotate(${hue}deg)`;
            },
            get status(){ return status }
        };
    };
    
    const ColorModuleConstructor = function(){
        const datasheet = {
            hex: "#FFFFFF",
            rgb: "rgb(255,255,255)",
            hsl: "hsl(0,50%,100%)",
            values: {
                red: 255,
                green: 255,
                blue: 255,
                alpha: 1,
                hue: 0,
                luminosity: 100,
                saturation: 50
            }
        };
        
        const rgba = (fill) => {
            const color = getComputedStyle(fill).backgroundColor;
            const regExp = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/;
            const [, red, green, blue, alpha] = color.match(regExp);
            
            return {
                rgb: color,
                values: {
                    red: parseInt(red),
                    green: parseInt(green),
                    blue: parseInt(blue),
                    alpha: alpha !== undefined ? parseFloat(alpha) : 1
                }
            };
        };
        
        const hsla = () => {
            const {red, green, blue} = datasheet.values;
            const r = red/255, g = green/255, b = blue/255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let hue, saturation, luminosity = (max + min)/2;
            
            if(max === min) hue = saturation = 0;
            else{
                const d = max - min;
                saturation = d/(luminosity > 0.5 ? (2 - max - min) : (max + min));
                hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
                hue /= 6;
            };
            
            hue = Math.round(hue * 360); saturation = Math.round(saturation * 100); luminosity = Math.round(luminosity * 100);
            Object.assign(datasheet.values, {hue, saturation, luminosity});
        };
        
        const callbacks = [];
        let picker = null;
        
        return {
            preview: createViewer(),
            
            get value(){ return datasheet },
            set value(color){
                this.preview.fill.style.backgroundColor = color;
                if(this.picker) this.picker.style.backgroundColor = color;
                
                const r = rgba(this.picker ? this.picker : this.preview.fill);
                Object.assign(datasheet, r);
                hsla();
                
                const {red, green, blue, alpha, hue, saturation, luminosity} = datasheet.values;
                datasheet.hex = ('#' + ((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1) + ((alpha < 1 && alpha > 0) ? Math.round(alpha * 255).toString(16) : alpha <= 0 ? "00" : "")).toUpperCase();
                datasheet.hsl = `hsl${alpha < 1 ? "a" : ""}(${hue}, ${saturation}%, ${luminosity}%${alpha < 1 ? ", " + alpha.toFixed(1) : ""})`;
                
                callbacks.forEach(e => e(datasheet));
            },
            
            get picker(){ return picker },
            set picker(element){
                picker = element;
                if(picker) this.value = getComputedStyle(picker).backgroundColor;
            },
            
            registerCallback(callback){
                callbacks.push(callback);
            }
        };
    };
    
    const FormatModuleConstructor = (changes, ColorModule) => {
        const component = document.createElement('div');
        const select = document.createElement('select');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        
        component.className = 'clx-format-control';
        component.appendChild(select);
        component.appendChild(input);
        
        const avaibled = {
            hex: /^#([0-9A-Fa-f]{3}){1,2}$|^#([0-9A-Fa-f]{8})$/,
            rgb: /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/,
            hsl: /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/
        }; 
        
        for(f in avaibled){
            const option = document.createElement('option');
            option.textContent = f;
            
            select.appendChild(option);
        };
        
        let format = 'hex';
        let value = '#FFFFFF';
        
        const callbacks = [];
        
        return {
            init: function(callback){
                (() => {
                    input.addEventListener('input', () => this.value = input.value);
                    input.addEventListener('focus', () => this.status = 'input');
                    input.addEventListener('blur', () => {
                        input.value = ColorModule.value[format];
                        this.status = 'output';
                        
                        changes.forEach(e => e(ColorModule.value));
                    });
                    
                    select.addEventListener('change', () => this.value = format = select.value);
                    
                    document.addEventListener('touchstart', () => input.blur());
                    document.addEventListener('mousedown', () => input.blur());
                    
                    delete this.init;
                })();
                
                if(typeof callback === 'function')
                callback(component);
            },
            
            status: 'output',
            
            get value(){ return value },
            set value(data){
                const string = data.toLowerCase();
                
                if(this.status === 'input'){
                    this.format = /^#|^hex/.test(string) ? "hex" : /^rgba?/.test(string) ? "rgb" : /^hsla?/.test(string) ? "hsl" : format;
                    
                    if(/^hex/.test(string)) input.value = '#';
                    
                    if(avaibled[format].test(string)){
                        ColorModule.value = string;
                        callbacks.forEach(e => e(string, ColorModule.value));
                    };
                    
                    return;
                };
                
                input.value = value = ColorModule.value[format];
            },
            
            get format(){ return format },
            
            registerCallback(callback){
                callbacks.push(callback);
            }
        };
    };
    
    return class {
        static create(options) {
            return new Colorx(options);
        };

        static defaultOptions = {
            container: 'body',
            alwaysOpen: false,
            showPreview: true,
            numberOfPickers: 1,
            showFormats: true,
            lastestColorLimit: 8,
            favoriteColorLimit: 6,
            spectrumType: 'clasic',
            swatches: [
               "#FF0000", // Rojo
               "#00FF00", // Verde
               "#0000FF", // Azul
               "#FFFF00", // Amarillo
               "#FF00FF", // Magenta
               "#00FFFF", // Cian
               "#800080", // Púrpura
               "#FFA500", // Naranja
               "#FF000080", // Rojo
               "#00FF0080", // Verde
               "#0000FF80", // Azul
               "#FFFF0080", // Amarillo
               "#FF00FF80", // Magenta
               "#00FFFF80", // Cian
               "#80008080", // Púrpura
               "#FFA50080"  // Naranja
            ],
            showOpacityControl: true,
        };

        constructor(options) {
            let {
                template,
                container,
                alwaysOpen,
                numberOfPickers,
                showPreview,
                showFormats,
                lastestColorLimit,
                favoriteColorLimit,
                spectrumType,
                swatches,
                showOpacityControl,
            } = Object.assign({}, Colorx.defaultOptions, options);
            
            if(template === undefined) return console.error('Missing [template] property value');
            else if(template !== 'none'){
                if(typeof template !== 'string') return console.error('Expected a string value for the [template] property');
                else if(!document.querySelector('link.Colorx-Template[title=' + template + ']')) return console.error('Unable to find or load the specified stylesheet template');
            };
            
            const componentsRegister = {};
            const ColorModule = ColorModuleConstructor();
            
            container = document.querySelector(container);
            if (!container) return console.error('Container not found');
            
            const box = document.createElement('div');
            box.classList.add('clx-box');
            box.classList.add(alwaysOpen ? 'clx-open-box' : 'clx-close-box');
            
            componentsRegister['box'] = box;
            
            this.updating = (callback) => {
                ColorModule.registerCallback(callback);
            };
            
            const changes = [];
            this.changing = (callback) => {
                changes.push(callback);
            };
            
            if(typeof alwaysOpen !== 'boolean')
            return console.error('Expected a boolean value for the [alwaysOpen] property');
            
            if(!alwaysOpen){
                this.open = () => {
                    box.classList.remove('clx-close-box');
                    box.classList.add('clx-open-box');
                };
                
                this.close = () => {
                    box.classList.remove('clx-open-box');
                    box.classList.add('clx-close-box');
                };
            };
            
            if(typeof showFormats !== 'boolean')
            return console.error('Expected a boolean value for the [showFormats] property');
            
            if(showFormats){
                const module = FormatModuleConstructor(changes, ColorModule);
                module.init((component) => {
                    box.appendChild(component);
                    componentsRegister['format-control'] = component;
                });
                
                this.updating((color) => {
                    if(module.status === 'output') 
                    module.value = color[module.format];
                });
                
                this.writing = (callback) => {
                    module.registerCallback(callback);
                    return callback;
                };
            };
            
            if(typeof showPreview !== 'boolean')
            return console.error('Expected a boolean value for the [showPreview] property');
            
            if(numberOfPickers <= 0 || showPreview){
                const { element } = ColorModule.preview;
                
                element.classList.add('clx-preview');
                element.classList.add('clx-primary-preview');
                
                box.appendChild(element);
                componentsRegister['primary-preview'] = element;
            };
            
            if(typeof lastestColorLimit !== 'number')
            return console.error('Expected a number value for the [lastestColorLimit] property');
            
            if(lastestColorLimit){
                const lastestColorsList = [];
                
                const lastestColorCallbacks = [];
                this.updatingLastestColors = (callback) => {
                    lastestColorCallbacks.push(callback);
                };
                
                const {component, viewers} = createListColors(lastestColorLimit, changes, ColorModule);
                component.classList.add('clx-lastest-colors');
                
                box.appendChild(component);
                componentsRegister['lastest-colors'] = component;
                
                this.changing((color) => {
                    if(!color) return;
                    else if(viewers.some(v => getComputedStyle(v).backgroundColor === color.rgb)) return;
                        
                    viewers
                      .reduce((a, e) => {
                          a.unshift(e);
                          return a;
                      }, [])
                      .forEach((e, i, a) => {
                          if(i < a.length - 1) e.style.backgroundColor = getComputedStyle(a[i + 1]).backgroundColor;
                          else e.style.backgroundColor = color.rgb;
                      });
                    
                    lastestColorsList.push({...color});
                    
                    while(lastestColorsList.length >= lastestColorLimit)
                    lastestColorsList.pop();
                    
                    lastestColorCallbacks.forEach(e => e(lastestColorsList));
                });
            };
            
            if(typeof favoriteColorLimit !== 'number')
            return console.error('Expected a number value for the [favoriteColorLimit] property');
            
            if(favoriteColorLimit){
                const favoritesList = [];
                
                const favoritesCallbacks = [];
                this.updatingFavorites = (callback) => {
                    favoritesCallbacks.push(callback);
                };
                
                const {component, viewers} = createListColors(favoriteColorLimit, changes, ColorModule);
                const addButton = document.createElement('button');
                
                addButton.classList.add('clx-add-favorite');
                
                const add = () => {
                    if(!viewers.find(e => getComputedStyle(e).backgroundColor === ColorModule.value.rgb)){
                        viewers
                        .reduce((a, e) => {
                            a.unshift(e);
                            return a;
                        }, [])
                        .forEach((e, i, a) => {
                            if(i > 0)
                            a[i - 1].style.backgroundColor = getComputedStyle(e).backgroundColor;
                        });
                        
                        viewers[0].style.backgroundColor = ColorModule.value.rgb;
                        
                        favoritesList.push({...ColorModule.value});
                        
                        while(favoritesList.length >= favoriteColorLimit)
                        favoritesList.pop();
                        
                        favoritesCallbacks.forEach(e => e(favoritesList));
                    };
                };
                
                addButton.addEventListener('touchstart', add);
                addButton.addEventListener('mousedown', add);
                
                const clearButton = document.createElement('button');
                clearButton.classList.add('clx-clear-favorites');
                
                const clear = () => {
                    viewers.forEach(e => e.style.backgroundColor = 'transparent');
                    favoritesCallbacks.forEach(e => e(favoritesList));
                    
                    while(favoritesList.length > 0)
                    favoritesList.pop();
                };
                
                clearButton.addEventListener('touchstart', clear);
                clearButton.addEventListener('mousedown', clear);
                
                component.insertBefore(addButton, viewers[0].parentElement);
                component.insertBefore(clearButton, addButton);
                
                component.classList.add('clx-favorites');
                
                box.appendChild(component);
                
                componentsRegister['favorites'] = component;
                componentsRegister['add-favorite'] = addButton;
                componentsRegister['clear-favorites'] = clearButton;
            };
            
            const sliderRegister = [];
            this.sliderDrag = (callback) => {
                sliderRegister.push(callback);
            };
            
            if(typeof spectrumType !== 'string')
            return console.error('Expected a string value for the [spectrumType] property');
            
            spectrumType = spectrumType.toLowerCase().trim();
            if(spectrumType !== 'none'){
                let spectrum;
                
                if(spectrumType === 'clasic')
                spectrum = createClasicSpectrum(changes, sliderRegister, ColorModule);
                
                else if(spectrumType === 'circle')
                spectrum = createCircleSpectrum(changes, sliderRegister, ColorModule);
                
                else {
                    console.error('[spectrumType] property not found. Try [clasic or circle] value');
                    return;
                };
                
                box.appendChild(spectrum.component);
                
                componentsRegister['spectrum'] = spectrum.spectrumElement;
                componentsRegister['hue-control'] = spectrum.slider;
                
                this.updating((color) => {
                    if(spectrum.status === 'output'){
                        spectrum.draw(color.values.hue);
                        spectrum.sinchronize();
                    };
                });
                
                this.navigating = (callback) => {
                    spectrum.callbacks.push(callback);
                };
            };
            
            if(swatches.length === undefined)
            return console.error('Expected an array value for the [swatches] property');
            
            if(swatches.length > 0){
                const {component, viewers} = createListColors(swatches.length, changes, ColorModule);
                component.classList.add('clx-swatches');
                
                viewers.forEach((e, i) => e.style.backgroundColor = swatches[i]);
                box.appendChild(component);
                
                componentsRegister['swatches'] = component;
            };
            
            if(typeof showOpacityControl !== 'boolean')
            return console.error('Expected a boolean value for the [showOpacityControl] property');
            
            if(showOpacityControl){
                const opacityControl = createSlider(200);
                opacityControl.element.className = 'clx-opacity-control';
                
                let status = 'output';
                
                opacityControl.isDrag((x, y) => {
                    let status = 'input';
                    opacityControl.thumb.style.transition = 'none';
                     
                    const value = (x | y) / 100;
                    const {red, blue, green} = ColorModule.value.values;
                     
                    ColorModule.value = `rgba(${red},${green},${blue},${value})`;
                    
                    sliderRegister.forEach(e => e({
                        name: 'opacity control',
                        value: x | y,
                        x: opacityControl.thumb.getBoundingClientRect().left,
                        y: opacityControl.thumb.getBoundingClientRect().top
                    }, ColorModule.value));
                });
                
                opacityControl.element.addEventListener('touchend', () => {
                    changes.forEach(e => e(ColorModule.value));
                    status = 'output';
                });
                
                opacityControl.element.addEventListener('mouseup', () => {
                    changes.forEach(e => e(ColorModule.value));
                    status = 'output';
                });
            
                box.appendChild(opacityControl.element);
                componentsRegister['opacity-control'] = opacityControl.element;
                
                this.updating((color) => {
                    if(status === 'output'){
                        const {alpha} = color.values;
                        const value = alpha * 100;
                         
                        opacityControl.thumb.style.transition = 'left .5s, top .5s';
                        
                        opacityControl.thumb.style.left = value * (opacityControl.element.clientWidth - opacityControl.thumb.offsetWidth) / 100 + 'px';
                        opacityControl.thumb.style.top = value * (opacityControl.element.clientHeight - opacityControl.thumb.offsetHeight) / 100 + 'px';
                    };
                });
            };
            
            if(typeof numberOfPickers !== 'number')
            return console.error('Expected a number value for the [numberOfPickers] property');
            
            for(let i = 0; i < numberOfPickers; i += 1){
                const picker = createViewer();
                
                const selectPicker = (event) => {
                    event.preventDefault();
                    
                    if(ColorModule.picker === picker.fill){
                        ColorModule.picker = null;
                        !alwaysOpen && this.close();
                        return;
                    };
                    
                    ColorModule.picker = picker.fill;
                    !alwaysOpen && this.open();
                    
                    changes.forEach(e => e(ColorModule.value));
                };
                
                picker.element.classList.add('clx-picker');
                picker.fill.style.backgroundColor = 'white';
                
                picker.element.addEventListener('touchstart', selectPicker);
                picker.element.addEventListener('mousedown', selectPicker);
                
                container.appendChild(picker.element);
                componentsRegister['picker-' + (i + 1)] = picker.element;
            };
            
            container.appendChild(box);
            
            this.change = (string, callback) => {
                ColorModule.value = string;
                changes.forEach(e => e(ColorModule.value));
                
                if(typeof callback === 'function')
                callback(ColorModule.value);
                
                else return ColorModule.value;
            };
            
            this.components = (name, callback) => {
                if(name === '*') callback(componentsRegister);
                
                else if(name === 'foreach'){
                    for(const component in componentsRegister){
                        callback(componentsRegister[component]);
                    };
                }
                
                else if(componentsRegister.hasOwnProperty(name))
                callback(componentsRegister[name]);
                
                else console.error(name + ' is not found');
            };
            
            if(template !== 'none')
            this.components('foreach', (e) => {
                e.setAttribute('template', template);
                [...e.children].forEach(a => a.setAttribute('template', template));
            });
        };
        
        on(event, callback){
            switch(event){
                case 'change':
                this.changing((a) => callback(a));
                break;
                case 'update':
                this.updating((a, b) => callback(a, b));
                break;
                case 'write':
                if(this.writing)
                this.writing((a, b) => callback(a, b));
                break;
                case 'navigate':
                this.navigating((a, b) => callback(a, b));
                break;
                case 'slider-drag': 
                this.sliderDrag((a, b) => callback(a, b));
                break;
                case 'update-favorites':
                if(this.updatingFavorites)
                this.updatingFavorites((a) => callback(a));
                break;
                case 'update-lastest-colors':
                if(this.updatingLastestColors)
                this.updatingLastestColors((a) => callback(a));
                break;
                default:
                console.error(event +  ' is not a valid argument')
                break;
            };
        };
        
        selected(string, callback){
            if(string === '*'){
                if(typeof callback === 'function')
                callback(ColorModule.value);
                    
                else return ColorModule.value;
            };
                
            const all = {...ColorModule.value, ...ColorModule.value.values};
            if(all.hasOwnProperty(string)){
                if(typeof callback === 'function')
                callback(all[string]);
                    
                else return all[string];
            }
                
            else console.error(string + ' not found');
        };
    };
})();
