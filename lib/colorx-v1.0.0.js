/*
 * --------------------------------------------------------------
 * ColorX - Biblioteca JavaScript para Manipulación y Selección de Colores
 * --------------------------------------------------------------
 *
 * @version 1.0.0
 * @description
 * ColorX es una biblioteca versátil que proporciona funcionalidades para la manipulación,
 * selección y gestión de colores. Con características como almacenamiento de colores favoritos,
 * visualización de los últimos colores seleccionados, gestión de una paleta de muestra,
 * ajuste de opacidad, tono, saturación, luminosidad, rojo, verde y azul, y selección de colores
 * mediante un espectro y un campo de texto con diferentes formatos. Además, ofrece clases y un
 * gestor de opciones para facilitar la personalización. También incluye un sistema de eventos y
 * métodos para acceder a los componentes impresos, el color seleccionado o la selección de color
 * desde JavaScript.
 *
 * @author Leonardo Berbin
 */

/*
 * --------------------------------------------------------------
 * Opciones del Selector de Color:
 * --------------------------------------------------------------
 * Este objeto define las opciones disponibles para personalizar el comportamiento
 * y la apariencia del selector de color.
 * 
 * Propiedades:
 * - container: Elemento contenedor donde se ubicará el selector de color.
 * - alwaysOpen: Indica si el selector de color debe estar siempre abierto o cerrado inicialmente.
 * - showPreview: Indica si se debe mostrar una vista previa del color seleccionado.
 * - numberOfPickers: Número de selectores de color que se pueden mostrar.
 * - showFormats: Indica si se deben mostrar los formatos de color disponibles.
 * - lastestColorLimit: Número máximo de colores recientes que se mostrarán.
 * - favoriteColorLimit: Número máximo de colores favoritos que se pueden almacenar.
 * - spectrumType: Tipo de espectro de color a utilizar (clasic, circle, none).
 * - showSliderBar: Indica si se debe mostrar la barra deslizante de ajuste de color.
 * - swatches: Colores predefinidos que se mostrarán como paleta de selección rápida.
 * - showOpacityControl: Indica si se debe mostrar el control de opacidad.
 *
 * Nota: Asegúrate de ajustar correctamente estas opciones según tus necesidades antes de instanciar el selector de color.
 */

/*
 * --------------------------------------------------------------
 * Métodos y Eventos de la Instancia del Selector de Color:
 * --------------------------------------------------------------
 * 
 * Métodos:
 * - change(string, callback): Cambia el valor del color y llama a una función de devolución de llamada opcional.
 * - components(name, callback): Proporciona acceso a los componentes del selector de color.
 * - on(event, callback): Registra devoluciones de llamada para eventos específicos.
 * - selected(string, callback): Devuelve o llama a una función de devolución de llamada para un valor específico del color seleccionado.
 * 
 * Eventos:
 * - change: Se activa cuando el color seleccionado cambia.
 * - update: Se activa cuando se actualiza el color seleccionado.
 * - write: Se activa cuando se escribe en el color seleccionado.
 * - navigate: Se activa cuando se navega por el selector de color.
 * - slider-drag: Se activa cuando se arrastra un control deslizante.
 * - update-favorites: Se activa cuando se actualiza la lista de colores favoritos.
 * - update-lastest-colors: Se activa cuando se actualiza la lista de los últimos colores seleccionados.
 *
 * Nota: Asegúrate de tener una versión actualizada de este código antes de usarlo en producción.
 */

/*
 * --------------------------------------------------------------
 * Clases Utilizadas en los Componentes del Selector de Color:
 * --------------------------------------------------------------
 * 
 * Estas clases son utilizadas en los diferentes componentes del selector de color para aplicar estilos personalizados.
 * Puedes utilizar estas clases como referencia al aplicar estilos personalizados a los componentes del selector de color.
 * 
 * - clx-container: Contenedor asignado del DOM
 * - clx-box: Contenedor principal del selector de color.
 *   - clx-open-box: Clase añadida cuando el selector de color está abierto.
 *   - clx-close-box: Clase añadida cuando el selector de color está cerrado.
 * - clx-preview: Clase para la vista previa del color seleccionado.
 *   - clx-primary-preview: Clase para la vista previa principal del color seleccionado.
 * - clx-list-color: Clase para las listas de colores.
 *   - clx-lastest-colors: Clase para la lista de colores recientes.
 *   - clx-favorites: Clase para la lista de colores favoritos.
 *   - clx-swatches: Clase para la paleta de selección rápida de colores.
 * - clx-picker: Clase para los selectores de color individuales.
 * - clx-add-favorite: Clase para el botón de agregar color a favoritos.
 * - clx-clear-favorites: Clase para el botón de borrar todos los colores favoritos.
 * - clx-opacity-control: Clase para el control deslizante de opacidad.
 * - clx-format-control: Clase para el control de formatos de color.
 * - clx-slider-bar: Clase para la barra de deslizadores.
 *   - clx-red-control: Clase para el control deslizante de rojo.
 *   - clx-blue-control: Clase para el control deslizante de azul.
 *   - clx-green-control: Clase para el control deslizante de verde.
 *   - clx-hue-control: Clase para el control deslizante de tonalidad.
 *   - clx-saturation-control: Clase para el control deslizante de saturación.
 *   - clx-luminosity-control: Clase para el control deslizante de luminosidad.
 * - clx-hue-spectrum-control: Clase para el control de tonalidad del espectro.
 * - clx-spectrum: Clase para el espectro de colores.
 *   - clx-clasic-spectrum: Clase para el espectro clásico.
 *   - clx-hue-clasic-spectrum-control: Clase para el control de tonalidad del espectro clásico.
 *   - clx-circle-spectrum: Clase para el espectro circular.
 *   - clx-hue-circle-spectrum-control: Clase para el control de tonalidad del espectro circular.
 * - clx-spectrum-component: Clase para el contenedor del espectro y su control de tonalidades.
 *   - clx-clasic-spectrum-component: Clase para el contenedor del espectro clasico y su control de tonalidades.
 *   - clx-circle-spectrum-component: Clase para el contenedor del espectro circular y su control de tonalidades.
 * - clx-spectrum-thumb: Clase para el manejador del espectro de colores.
 *   - clx-clasic-spectrum-thumb: Clase para el manejador del espectro clásico.
 *   - clx-circle-spectrum-thumb: Clase para el manejador del espectro circular.
 * 
 * Estas definiciones proporcionan una estructura jerárquica de las clases utilizadas en los componentes del selector de color, lo que facilita la comprensión de cómo se relacionan entre sí.
 */

const Colorx = (function () {
    /**
     * Función para crear un visor de colores.
     * @returns {Object} Objeto que contiene el elemento del visor, el elemento de relleno y el lienzo.
     */
    const createViewer = () => {
        // Crear elementos del visor
        const element = document.createElement('div'); // Contenedor principal
        const canvas = document.createElement('canvas'); // Lienzo para dibujar cuadrícula de colores
        const fill = document.createElement('div'); // Elemento de relleno para indicar selección

        // Estilos básicos para los elementos
        const basicStyles = {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0
        };

        // Aplicar estilos al lienzo y al relleno
        Object.assign(canvas.style, { ...basicStyles, pointerEvents: "none" });
        Object.assign(fill.style, basicStyles);
    
        // Configurar dimensiones del lienzo
        canvas.width = 400;
        canvas.height = 400;

        // Dibujar cuadrícula de colores en el lienzo
        const context = canvas.getContext("2d");
        const size = 100; // Tamaño de cada cuadrado en la cuadrícula
        for (let row = 0; row < canvas.width / size; row++) {
            for (let column = 0; column < canvas.width / size; column++) {
                const x = column * size;
                const y = row * size;
                const isEvenSquare = (row + column) % 2 === 0; // Verificar si es cuadrado par o impar
                // Asignar color al cuadrado en función de si es par o impar
                context.fillStyle = isEvenSquare ? "#FFFFFF40" : "#00000040";
                context.fillRect(x, y, size, size); // Dibujar cuadrado
            }
        }

        // Aplicar estilos al contenedor principal y añadir elementos hijos
        element.style.position = "relative";
        element.appendChild(canvas);
        element.appendChild(fill);
    
        // Devolver objetos que representan los elementos del visor
        return { element, fill, canvas };
    };
    
    /**
     * Función para crear un control deslizante interactivo.
     * @returns {Object} Objeto que contiene el elemento del control deslizante, el elemento de relleno,
     *                   el botón deslizante y una función para suscribirse a eventos de arrastre.
     */
    const createSlider = () => {
        // Crear elementos del control deslizante
        const element = document.createElement('div'); // Contenedor principal
        const fill = document.createElement('div'); // Elemento de relleno para indicar valor seleccionado
        const thumb = document.createElement('button'); // Botón deslizante

        // Establecer estilos de posición para el contenedor principal y el botón deslizante
        element.style.position = 'relative';
        thumb.style.position = 'absolute';

        // Añadir elementos hijos al contenedor principal
        element.appendChild(fill);
        element.appendChild(thumb);

        // Array para almacenar funciones de devolución de llamada
        const callbacks = [];

        // Función para manejar el arrastre del botón deslizante
        const drag = (event) => {
            event.preventDefault();

            // Función para manejar el inicio del arrastre
            const start = (event) => {
                const touches = event.touches || [];
                const e = touches?.[0] ?? event;
                const rect = element.getBoundingClientRect();

                // Calcular coordenadas relativas dentro del contenedor principal
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calcular límites de desplazamiento
                const maxX = element.clientWidth - thumb.offsetWidth;
                const maxY = element.clientHeight - thumb.offsetHeight;

                // Limitar las coordenadas dentro del rango permitido
                const boundedX = Math.min(Math.max(0, x), maxX);
                const boundedY = Math.min(Math.max(0, y), maxY);

                // Mover el botón deslizante a las coordenadas calculadas
                thumb.style.left = boundedX + "px";
                thumb.style.top = boundedY + "px";

                // Calcular y ejecutar las funciones de devolución de llamada con el valor seleccionado
                callbacks.forEach(callback => callback(boundedX * 100 / maxX, boundedY * 100 / maxY));
            };

            // Función para manejar el final del arrastre
            const end = () => {
                // Remover los event listeners para evitar múltiples llamadas
                document.removeEventListener('touchmove', start);
                document.removeEventListener('touchend', end);
                document.removeEventListener('mousemove', start);
                document.removeEventListener('mouseup', end);
            };

            // Agregar event listeners para detectar el arrastre del botón deslizante
            document.addEventListener('touchmove', start);
            document.addEventListener('touchend', end);
            document.addEventListener('mousemove', start);
            document.addEventListener('mouseup', end);
        };

        // Agregar event listeners para el inicio del arrastre del botón deslizante
        thumb.addEventListener('touchstart', drag);
        element.addEventListener('touchstart', drag);
        thumb.addEventListener('mousedown', drag);
        element.addEventListener('mousedown', drag);

        // Devolver objetos que representan los elementos del control deslizante y la función de suscripción a eventos de arrastre
        return { 
            element, 
            fill, 
            thumb,
            isDrag: (callback) => {
                callbacks.push(callback)
            }
        };
    };
    
    /**
     * Función para crear una lista de vistas previas de colores.
     * @param {number} number - Número de vistas previas de colores que se crearán.
     * @param {Array<Function>} changes - Array de funciones de devolución de llamada para realizar cambios cuando se selecciona un color.
     * @param {Object} ColorModule - Módulo de color para almacenar y manipular el color seleccionado.
     * @returns {Object} Objeto que contiene el componente de lista de colores y un array de elementos de vista previa de colores.
     */
    const createListColors = (number, changes, ColorModule) => {
        // Crear un componente contenedor para la lista de colores
        const component = document.createElement('div');
        component.className = 'clx-list-color';

        // Array para almacenar los elementos de vista previa de colores
        const viewers = [];

        // Iterar sobre el número de vistas previas de colores especificado
        for (let i = 0; i < number; i += 1) {
            // Crear una vista previa de color utilizando la función createViewer
            const viewer = createViewer();
            viewer.element.className = 'clx-preview';
            
            // Agregar event listeners para detectar el inicio del contacto o clic en la vista previa de color
            viewer.element.addEventListener('touchstart', () => {
                // Obtener el color de fondo de la vista previa de color seleccionada y almacenarlo en el módulo de color
                ColorModule.value = getComputedStyle(viewer.fill).backgroundColor;
            
                // Ejecutar las funciones de devolución de llamada de cambios con el nuevo color seleccionado
                changes.forEach(callback => callback(ColorModule.value));
            });
        
            viewer.element.addEventListener('mousedown', () => {
                // Obtener el color de fondo de la vista previa de color seleccionada y almacenarlo en el módulo de color
                ColorModule.value = getComputedStyle(viewer.fill).backgroundColor;
            
                // Ejecutar las funciones de devolución de llamada de cambios con el nuevo color seleccionado
                changes.forEach(callback => callback(ColorModule.value));
            });

            // Añadir el elemento de relleno de la vista previa de color al array de elementos de vista previa
            viewers.push(viewer.fill);
        
            // Añadir la vista previa de color al componente contenedor
            component.appendChild(viewer.element);
        };

        // Devolver el componente de lista de colores y el array de elementos de vista previa de colores
        return { component, viewers };
    };
    
    /**
     * Función para crear un espectro clásico de colores con controles deslizantes para el tono.
     * @param {Array<Function>} changes - Array de funciones de devolución de llamada para realizar cambios cuando se selecciona un color.
     * @param {Array<Function>} sliderRegister - Array de funciones de registro de deslizadores.
     * @param {Object} ColorModule - Módulo de color para almacenar y manipular el color seleccionado.
     * @returns {Object} Objeto que contiene el componente del espectro, el control deslizante del tono y métodos para sincronizar y obtener el estado.
     */
    const createClasicSpectrum = (changes, sliderRegister, ColorModule) => {
        // Crear elementos del espectro y controles deslizantes
        const {element, fill, thumb, isDrag} = createSlider();
        const spectrum = document.createElement('canvas');
        const hueControl = createSlider();
    
        // Establecer clases y estilos para los elementos del espectro y los controles deslizantes
        element.classList = thumb.classList = [];
        element.classList.add('clx-spectrum') 
        element.classList.add('clx-clasic-spectrum');
    
        // Establecer dimensiones y estilos para el lienzo del espectro
        spectrum.style.width = spectrum.style.height = '100%';
        spectrum.width = spectrum.height = 500;
    
        // Establecer estilos y clases para el control deslizante del espectro
        thumb.style.minHeight = thumb.style.minWidth = '5%';
        thumb.classList.add('clx-spectrum-thumb');
        thumb.classList.add('clx-clasic-spectrum-thumb');
    
        // Insertar el lienzo del espectro en el componente y eliminar el elemento de relleno predeterminado
        element.insertBefore(spectrum, fill);
        element.removeChild(fill);
    
        // Obtener el contexto del lienzo del espectro
        const context = spectrum.getContext('2d', {willReadFrequenly: true});
    
        // Función para dibujar el espectro según el tono especificado
        const draw = (hue) => {
            // Limpiar el lienzo
            context.clearRect(0, 0, 500, 500);
        
            // Crear gradientes de color para el espectro
            const a = `hsl(${hue}, 100%, 50%)`;
            const b = context.createLinearGradient(0, 0, 500, 0);
            b.addColorStop(0, "hsla(0, 0%, 100%, 1)");
            b.addColorStop(.01, "hsla(0, 0%, 100%, 1)");
            b.addColorStop(1, "hsla(0, 0%, 100%, 0)");
            const c = context.createLinearGradient(0, 500, 0, 0);
            c.addColorStop(0, "hsla(0, 0%, 0%, 1)");
            c.addColorStop(1, "hsla(0, 0%, 0%, 0)");
        
            // Rellenar el lienzo con los gradientes
            [a, b, c].forEach(gradient => {
                context.fillStyle = gradient;
                context.fillRect(0, 0, 500, 500);
            });
        };
    
        // Inicializar el espectro con un tono de 0 grados
        draw(0);
    
        // Función para leer el color seleccionado del espectro en una posición dada
        const readSpectrum = (x, y) => {
            let dx = Math.round(x * 5);
            let dy = Math.round(y * 5);
        
            // Asegurarse de que las coordenadas estén dentro de los límites del lienzo
            dx -= dx > 499 ? 1 : 0;
            dx -= dx > 499 ? 1 : 0;
            
            // Obtener el color del píxel en las coordenadas especificadas
            const [red, green, blue] = context.getImageData(dx, dy, 1, 1).data;
        
            // Actualizar el valor del color en el módulo de color con la transparencia actual
            if (ColorModule.value.values.alpha) {
                ColorModule.value = `rgba(${red}, ${green}, ${blue}, ${ColorModule.value.values.alpha})`;
            }
        
            // Ejecutar las funciones de devolución de llamada con la nueva selección de color y coordenadas
            callbacks.forEach(callback => {
                callback({
                    valueX: dx,
                    valueY: dy,
                    x: thumb.getBoundingClientRect().left,
                    y: thumb.getBoundingClientRect().top
                }, ColorModule.value);
            });
        };
    
        // Inicializar el estado del espectro
        let status = 'output';
        // Array de funciones de devolución de llamada para la sincronización
        const callbacks = [];
    
        // Evitar eventos de desplazamiento y arrastre al tocar o hacer clic en el espectro
        element.addEventListener('touchmove', (event) => event.preventDefault());
        element.addEventListener('mousemove', (event) => event.preventDefault());
    
        // Manejar eventos de arrastre del control deslizante del espectro
        isDrag((x, y) => {
            status = 'input';
            thumb.style.transition = 'none';
        
            // Leer el color seleccionado del espectro en la posición del control deslizante
            readSpectrum(x, y);
        
            // Actualizar la posición del control deslizante del espectro
            thumb.style.left = `calc(${x}% - ${thumb.offsetWidth/2}px)`;
            thumb.style.top = `calc(${y}% - ${thumb.offsetHeight/2}px)`;
        });
    
        // Manejar eventos de finalización del toque en el espectro
        element.addEventListener('touchend', () => {
            status = 'output';
            // Ejecutar las funciones de devolución de llamada de cambios con el color actual
            changes.forEach(callback => callback(ColorModule.value));
        });
    
        // Manejar eventos de liberación del ratón en el espectro
        element.addEventListener('mouseup', () => {
            status = 'output';
            // Ejecutar las funciones de devolución de llamada de cambios con el color actual
            changes.forEach(callback => callback(ColorModule.value));
        });
    
        // Crear un control deslizante adicional para el tono del espectro
        const slider = createSlider();
        slider.element.classList.add('clx-hue-spectrum-control');
        slider.element.classList.add('clx-hue-clasic-spectrum-control');
    
        // Manejar eventos de arrastre del control deslizante de tono
        slider.isDrag((x, y) => {
            status = 'input';
            slider.thumb.style.transition = 'none';
        
            // Calcular y dibujar el espectro según el nuevo valor de tono
            const value = x | y;
            draw(value * 3.6);
        
            // Obtener la saturación, luminosidad y alfa actuales del color seleccionado
            const {luminosity, saturation, alpha} = ColorModule.value.values;
        
            // Actualizar el color seleccionado con el nuevo valor de tono
            if (alpha) {
                ColorModule.value = `hsla(${value * 3.6}, ${saturation}%, ${luminosity}%, ${alpha})`;
            }
        
            // Ejecutar las funciones de registro de deslizadores con la nueva selección de tono
            sliderRegister.forEach(callback => {
                callback({
                    name: 'hue spectrum control',
                    value: x | y,
                    x: slider.thumb.getBoundingClientRect().left,
                    y: slider.thumb.getBoundingClientRect().top
                }, ColorModule.value);
            });
        });
    
        // Manejar eventos de finalización del toque en el control deslizante de tono
        slider.element.addEventListener('touchend', () => {
            status = 'output';
            // Ejecutar las funciones de devolución de llamada de cambios con el color actual
            changes.forEach(callback => callback(ColorModule.value));
        });
    
        // Manejar eventos de liberación del ratón en el control deslizante de tono
        slider.element.addEventListener('mouseup', () => {
            status = 'output';
            // Ejecutar las funciones de devolución de llamada de cambios con el color actual
            changes.forEach(callback => callback(ColorModule.value));
        });
    
        // Crear el componente contenedor del espectro
        const component = document.createElement('div');
    
        // Agregar clases al componente contenedor
        component.classList.add('clx-spectrum-component');
        component.classList.add('clx-clasic-spectrum-component');
    
        // Agregar elementos al componente contenedor
        component.appendChild(element);
        component.appendChild(slider.element);
    
        // Devolver el objeto que contiene los elementos y métodos del espectro
        return {
            callbacks,
            draw,
            component,
            spectrumElement: element,
            slider: slider.element, 
            // Método para sincronizar los controles deslizantes con el color seleccionado
            synchronize: () => {
                // Activar las transiciones para una actualización suavizada
                thumb.style.transition = slider.thumb.style.transition = 'left .5s, top .5s';
    
                // Obtener los valores de rojo, verde y azul del color seleccionado
                const {red, green, blue} = ColorModule.value.values;
                const rgba = [red, green, blue, 255];
                // Obtener los datos de píxeles del lienzo del espectro
                const data = context.getImageData(0, 0, 500, 500).data;
            
                // Buscar el píxel más cercano al color seleccionado
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
            
                // Calcular las coordenadas del píxel más cercano en porcentaje
                const x = Math.round(nearestX * 100 / 500);
                const y = Math.round(nearestY * 100 / 500);
            
                // Actualizar la posición del control deslizante de selección de color
                thumb.style.left = `calc(${x}% - ${thumb.offsetWidth / 2}px)`;
                thumb.style.top = `calc(${y}% - ${thumb.offsetHeight / 2}px)`;
            
                // Obtener el valor de tono actual del color seleccionado
                const {hue} = ColorModule.value.values;
                const value = hue * 100 / 360;
            
                // Actualizar la posición del control deslizante de tono
                slider.thumb.style.left = value * (slider.element.clientWidth - slider.thumb.offsetWidth) / 100 + 'px';
                slider.thumb.style.top = value * (slider.element.clientHeight - slider.thumb.offsetHeight) / 100 + 'px';
            },
            // Propiedad para obtener el estado actual del espectro
            get status() { return status }
        };
    };
    
    /**
     * Función para crear un espectro de colores circular con controles deslizantes para el tono.
     * @param {Array<Function>} changes - Array de funciones de devolución de llamada para realizar cambios cuando se selecciona un color.
     * @param {Array<Function>} sliderRegister - Array de funciones de registro de deslizadores.
     * @param {Object} ColorModule - Módulo de color para almacenar y manipular el color seleccionado.
     * @returns {Object} Objeto que contiene el componente del espectro, el control deslizante del tono y métodos para sincronizar y obtener el estado.
     */
    const createCircleSpectrum = (changes, sliderRegister, ColorModule) => {
        // Crear elementos del componente
        const component = document.createElement('div');
        const slider = document.createElement('div');
        const sliderThumb = document.createElement('button');
        const spectrumElement = document.createElement('div');
        const spectrum = document.createElement('canvas');
        const spectrumThumb = document.createElement('button');
    
        // Establecer clases y estilos para los elementos del espectro y los controles deslizantes
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
    
        // Insertar elementos en el componente
        spectrumElement.appendChild(spectrum);
        spectrumElement.appendChild(spectrumThumb);
    
        component.classList.add('clx-spectrum-component');
        component.classList.add('clx-circle-spectrum-component');
    
        Object.assign(component.style, {
            position: 'relative',
            height: 'auto',
            paddingTop: '100%',
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
    
        slider.classList.add('clx-hue-spectrum-control');
        slider.classList.add('clx-hue-circle-spectrum-control');
    
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
    
        // Obtener el contexto del lienzo del espectro
        const context = spectrum.getContext('2d', {willReadFrequenly: true});
    
        // Función para dibujar el espectro según el tono especificado
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
    
        // Dibujar el espectro inicialmente con un tono de 0 grados
        draw(0);
    
        // Inicializar el estado del espectro
        let status = 'output';
        // Array de funciones de devolución de llamada para la sincronización
        const callbacks = [];
    
        // Función para manejar el arrastre del control deslizante del tono
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
        
            // Calcular el tono según el ángulo
            const hue = Math.round(((angle - 270) % 360) + 360);
        
            // Obtener los valores actuales de saturación, luminosidad y alfa del color seleccionado
            const {saturation, luminosity, alpha} = ColorModule.value.values;
            // Actualizar el color seleccionado con el nuevo tono
            if(alpha) ColorModule.value = `hsla(${hue},${saturation}%,${luminosity}%,${alpha})`;
        
            // Dibujar el espectro con el nuevo tono
            draw(hue);
        
            // Ejecutar las funciones de registro de deslizadores con la nueva selección de tono
            sliderRegister.forEach(e => e({
                name: 'hue spectrum control',
                value: hue * 100/360,
                x: sliderThumb.getBoundingClientRect().left,
                y: sliderThumb.getBoundingClientRect().top
            }, ColorModule.value));
        };
    
        // Agregar eventos de arrastre al control deslizante del tono
        slider.addEventListener("touchmove", sliderDrag);
        slider.addEventListener("mousemove", sliderDrag);
    
        // Función para manejar el arrastre del thumb del espectro
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
        
            // Actualiza las coordenadas del thumb
            spectrumThumb.style.left = thumbX + "px";
            spectrumThumb.style.top = thumbY + "px";
        
            // Convierte las coordenadas del thumb a porcentajes
            let dx = thumbX * 500 / spectrum.offsetWidth;
            let dy = thumbY * 500 / spectrum.offsetHeight;
        
            // Ajusta las coordenadas para evitar bordes irregulares
            dx = dx <= 249 ? Math.ceil(dx) + 5 : Math.floor(dx);
            dy = dy <= 249 ? Math.ceil(dy) + 5 : Math.floor(dy);
            
            // Lee el color seleccionado en la posición del thumb del espectro
            const [red, green, blue] = context.getImageData(dx, dy, 1, 1).data;
            
            // Actualiza el color seleccionado con el nuevo valor de alfa si es necesario
            if(ColorModule.value.values.alpha)
            ColorModule.value = `rgba(${red}, ${green}, ${blue}, ${ColorModule.value.values.alpha})`;
        
            // Ejecutar las funciones de devolución de llamada con las coordenadas del thumb y el color seleccionado
            callbacks.forEach(e => e({
                valueX: dx,
                valueY: dy,
                x: spectrumThumb.getBoundingClientRect().left,
                y: spectrumThumb.getBoundingClientRect().top
            }, ColorModule.value));
        };
    
        // Agregar eventos de arrastre al thumb del espectro
        spectrumElement.addEventListener('touchmove', (event) => spectrumDrag(event));
        spectrumElement.addEventListener('mousemove', (event) => spectrumDrag(event));
    
        // Manejar eventos de finalización del toque o clic en el componente
        component.addEventListener('touchend', (event) => {
            status = 'output';
            // Ejecutar las funciones de devolución de llamada de cambios con el color actual
            changes.forEach(e => e(ColorModule.value));
        });
    
        component.addEventListener('mouseup', (event) => {
            status = 'output';
            // Ejecutar las funciones de devolución de llamada de cambios con el color actual
            changes.forEach(e => e(ColorModule.value));
        });
    
        // Devolver el objeto con propiedades y métodos relevantes
        return {
            callbacks,
            component,
            spectrumElement,
            slider,
            draw,
            synchronize: () => {
                // Sincronizar las transiciones de los thumbs
                slider.style.transition = 'transform 1s';
                spectrumThumb.style.transition = 'left .5s, top .5s';
    
                // Obtener los valores de color actuales
                const {red, green, blue} = ColorModule.value.values;
                const rgba = [red, green, blue, 255];
                const data = context.getImageData(0, 0, 500, 500).data;
            
                let nearestX, nearestY;
    
                // Buscar el pixel más cercano al color actual
                for (let i = 0; i < data.length; i += 4) {
                    const pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    const distance = Math.sqrt(
                    (pixel[0] - rgba[0]) ** 2 +
                    (pixel[1] - rgba[1]) ** 2 +
                    (pixel[2] - rgba[2]) ** 2 +
                    (pixel[3] - rgba[3]) ** 2
                    );
    
                    // Si la distancia es menor o igual a 2, se considera el pixel más cercano
                    if (distance <= 2) {
                        nearestX = (i / 4) % 500;
                        nearestY = Math.floor(i / 4 / 500);
                    };
                };
            
                const rect = spectrum.getBoundingClientRect();
            
                // Calcular las coordenadas del thumb del espectro
                const x = Math.round(nearestX * 100 / 500) * (spectrum.offsetWidth - spectrumThumb.offsetWidth) / 100;
                const y = Math.round(nearestY * 100 / 500) * (spectrum.offsetHeight - spectrumThumb.offsetHeight) / 100;
            
                // Establecer las coordenadas del thumb del espectro
                spectrumThumb.style.left = x + 'px';
                spectrumThumb.style.top = y + 'px';
            
                // Obtener el tono actual y establecer la rotación del control deslizante del tono
                const {hue} = ColorModule.value.values;
                slider.style.transform = `rotate(${hue}deg)`;
            },
            get status(){ return status }
        };
    };
    
    /**
     * createSliderBar - Crea un conjunto de controles deslizantes para ajustar los componentes de color de un módulo de color.
     *
     * @param {Object} ColorModule - El módulo de color que contiene los valores de color.
     * @param {Array} changes - Las funciones de devolución de llamada para notificar los cambios de color.
     * @returns {Object} - Retorna un objeto con los controles deslizantes creados, el componente contenedor y el estado actual.
     */
    const createSliderBar = (ColorModule, changes) => {
        // Crea el componente contenedor
        const component = document.createElement('div');
        component.className = 'clx-slider-bar';
    
        // Inicializa el estado como 'output'
        let status = 'output';
    
        // Objeto para almacenar los controles deslizantes
        const sliders = {};
    
        // Itera sobre las propiedades del módulo de color
        for(const property in ColorModule.value.values){
            // Excluye la propiedad 'alpha'
            if(property !== 'alpha'){
                // Crea un control deslizante para la propiedad actual
                const slider = createSlider();
            
                // Asigna clases y ajusta la transición del pulgar del control deslizante
                slider.element.classList.add('clx-slider');
                slider.element.classList.add(`clx-${property}-control`);
                slider.thumb.style.transition = 'top .5s, left .5s';
            
                // Configura el formato y el valor máximo del control deslizante según la propiedad
                switch(property){
                    case 'red':
                    case 'green':
                    case 'blue':
                    slider.format = 'rgba(red, green, blue, alpha)';
                    slider.max = 255;
                    break;
                    case 'hue': 
                    slider.format = 'hsla(hue, saturation%, luminosity%, alpha)';
                    slider.max = 359;
                    break;
                    case 'saturation':
                    case 'luminosity': 
                    slider.format = 'hsla(hue, saturation%, luminosity%, alpha)';
                    slider.max = 100;
                    break;
                };
            
                // Define el comportamiento al arrastrar el control deslizante
                slider.isDrag((x, y) => {
                    status = 'input';
                    slider.thumb.style.transition = 'none';
                
                    // Calcula el valor basado en la posición del control deslizante
                    const value = x | y;
                    ColorModule.value.values[property] = Math.round(value * slider.max / 100);
                
                    // Actualiza el valor de color en el módulo de color y ejecuta las devoluciones de llamada
                    const {red, green, blue, hue, luminosity, saturation, alpha} = ColorModule.value.values;
                    ColorModule.value =
                    slider.format
                      .replace(/red/, red)
                      .replace(/blue/, blue)
                      .replace(/green/, green) 
                      .replace(/hue/, hue)
                      .replace(/luminosity/, luminosity)
                      .replace(/saturation/, saturation)
                      .replace(/alpha/, alpha);
                });
            
                // Almacena el control deslizante en el objeto 'sliders' y lo agrega al componente contenedor
                sliders[property] = slider;
                component.appendChild(slider.element);
            };
        };
    
        // Define el comportamiento al soltar cualquier control deslizante
        component.addEventListener('touchend', () => {
            status = 'output';
        
            // Restaura la transición para todos los pulgares de control deslizante
            for(const slider in sliders){
                sliders[slider].thumb.style.transition = 'top .5s, left .5s';
            };
        
            // Ejecuta las funciones de devolución de llamada para notificar los cambios de color
            changes.forEach(e => e(ColorModule.value));
        });
    
        // Retorna el objeto con los controles deslizantes, el componente contenedor y el estado actual
        return {sliders, component, get status(){return status}};
    };
    
    /**
     * createColorModule - Crea un módulo para gestionar los valores de color y la interacción con los controles de color.
     *
     * @returns {Object} - Retorna un objeto que representa el módulo de color.
     */
    const createColorModule = function(){
        // Datos iniciales del módulo de color
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
                saturation: 50,
                luminosity: 100
            }
        };
    
        // Función para obtener los valores rgba de un color
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
    
        // Función para calcular los valores hsla a partir de los valores rgba
        const hsla = () => {
            const {red, green, blue} = datasheet.values;
            const r = red/255, g = green/255, b = blue/255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let hue, saturation, luminosity = (max + min)/2;
        
            if(max === min){
                hue = datasheet.values.hue / 360;
                saturation = datasheet.values.saturation / 100;
            } 
            else{
                const d = max - min;
                saturation = d/(luminosity > 0.5 ? (2 - max - min) : (max + min));
                hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
                hue /= 6;
            };
        
            hue = Math.round(hue * 360); saturation = Math.round(saturation * 100); luminosity = Math.round(luminosity * 100);
            Object.assign(datasheet.values, {hue, saturation, luminosity});
        };
    
        // Arreglo de funciones de devolución de llamada
        const callbacks = [];
        let picker = null;
    
        // Retorna el objeto que representa el módulo de color
        return {
            // Vista previa del color
            preview: createViewer(),
        
            // Getter y setter para los valores del módulo de color
            get value(){ return datasheet },
            set value(color){
                // Actualiza la vista previa del color
                this.preview.fill.style.backgroundColor = color;
                if(this.picker) this.picker.style.backgroundColor = color;
            
                // Calcula los valores rgba del nuevo color y actualiza el módulo de color
                const r = rgba(this.picker ? this.picker : this.preview.fill);
                Object.assign(datasheet.values, r.values);
                datasheet.rgb = r.rgb;
                hsla();
            
                // Calcula y actualiza los valores hex y hsl del módulo de color
                const {red, green, blue, alpha, hue, saturation, luminosity} = datasheet.values;
                datasheet.hex = ('#' + ((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1) + ((alpha < 1 && alpha > 0) ? Math.round(alpha * 255).toString(16) : alpha <= 0 ? "00" : "")).toUpperCase();
                datasheet.hsl = `hsl${alpha < 1 ? "a" : ""}(${hue}, ${saturation}%, ${luminosity}%${alpha < 1 ? ", " + alpha.toFixed(1) : ""})`;
            
                // Ejecuta las funciones de devolución de llamada
                callbacks.forEach(e => e(datasheet));
            },
        
            // Getter y setter para el selector de color (picker)
            get picker(){ return picker },
            set picker(element){
                picker = element;
                if(picker) this.value = getComputedStyle(picker).backgroundColor;
            },
        
            // Registra una función de devolución de llamada
            registerCallback(callback){
                callbacks.push(callback);
            }
        };
    };

    /**
     * createFormatControl - Crea un control para seleccionar el formato de color y proporcionar una entrada de texto para ingresar valores de color.
     *
     * @param {Array} changes - Las funciones de devolución de llamada para notificar los cambios de color.
     * @param {Object} ColorModule - El módulo de color que contiene los valores de color.
     * @returns {Object} - Retorna un objeto que representa el control de formato de color.
     */
    const createFormatControl = (changes, ColorModule) => {
        // Crea los elementos del control de formato
        const component = document.createElement('div');
        const select = document.createElement('select');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
    
        // Agrega clases al componente contenedor
        component.className = 'clx-format-control';
    
        // Agrega elementos al componente contenedor
        component.appendChild(select);
        component.appendChild(input);
    
        // Patrones de expresiones regulares para validar los formatos de color
        const avaibled = {
            hex: /^#([0-9A-Fa-f]{3}){1,2}$|^#([0-9A-Fa-f]{8})$/,
            rgb: /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/,
            hsl: /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\s*(?:,\s*(0|0\.\d+|1)\s*)?\)$/
        }; 
    
        // Agrega opciones al select basadas en los formatos disponibles
        for(f in avaibled){
            const option = document.createElement('option');
            option.textContent = f;
            select.appendChild(option);
        };
    
        // Valores predeterminados para el formato y el valor del control
        let format = 'hex';
        let value = '#FFFFFF';
    
        // Arreglo de funciones de devolución de llamada
        const callbacks = [];
    
        // Retorna el objeto que representa el control de formato de color
        return {
            init: function(callback){
                // Inicialización del control de formato
                (() => {
                    // Event listeners para el input y select
                    input.addEventListener('input', () => this.value = input.value);
                    input.addEventListener('focus', () => this.status = 'input');
                    input.addEventListener('blur', () => {
                        input.value = ColorModule.value[format];
                        this.status = 'output';
                        // Ejecuta las funciones de devolución de llamada al salir del input
                        changes.forEach(e => e(ColorModule.value));
                    });
                    select.addEventListener('change', () => this.value = format = select.value);
        
                    // Event listeners para ocultar el input al tocar o hacer clic fuera del control
                    document.addEventListener('touchstart', () => input.blur());
                    document.addEventListener('mousedown', () => input.blur());
        
                    // Elimina la función de inicialización para evitar su ejecución nuevamente
                    delete this.init;
                })();
                
                if(typeof callback === 'function')
                callback(component);
            },
            
            // Estado actual del control (input/output)
            status: 'output',
        
            // Getter y setter para el valor del control
            get value(){ return value },
            set value(data){
                const string = data.toLowerCase();
                // Si el control está en modo 'input', valida y actualiza el valor de color según el formato seleccionado
                if(this.status === 'input'){
                    this.format = /^#|^hex/.test(string) ? "hex" : /^rgba?/.test(string) ? "rgb" : /^hsla?/.test(string) ? "hsl" : format;
                    if(/^hex/.test(string)) input.value = '#';
                    if(avaibled[format].test(string)){
                        ColorModule.value = string;
                        callbacks.forEach(e => e(string, ColorModule.value));
                    };
                    return;
                };
                // Si el control está en modo 'output', actualiza el valor del input con el valor actual del módulo de color
                input.value = value = ColorModule.value[format];
            },
        
            // Getter para el formato actual del control
            get format(){ return format },
        
            // Registra una función de devolución de llamada
            registerCallback(callback){
                callbacks.push(callback);
            }
        };
    };
    
    // Definición de la clase Colorx
    return class {
        // Método estático para crear una instancia de Colorx con opciones personalizadas
        static create(options) {
            return new Colorx(options);
        };

        // Propiedades predeterminadas de la clase
        static defaultOptions = {
            container: null,
            alwaysOpen: false,
            showPreview: true,
            numberOfPickers: 1,
            showFormats: true,
            lastestColorLimit: 3,
            favoriteColorLimit: 10,
            spectrumType: 'none',
            showSliderBar: false,
            swatches: [
            // Colores predefinidos
            "#0033FF",
            "#FF3300",
            "#FF0066",
            "#FF00CC",
            "#FF9900",
            "#00FF66",
            "#FF0033",
            "#66FF00",
            "#FF6600",
            "#0099FF",
            "#00FF99",
            "#6600FF",
            "#00FFFF",
            "#FFCC00",
            "#00CCFF",
            "#FF00FF",
            "#FF5733",
            "#33FF57",
            "#5733FF",
            "#FFFF33",
            "#33FFFF",
            "#FF33FF",
            "#FF5733",
            "#33FF57",
            "#5733FF",
            "#FFFF33",
            "#33FFFF"
            ],
            showOpacityControl: true,
        };

        // Constructor de la clase
        constructor(options) {
            // Fusiona las opciones personalizadas con las predeterminadas
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
                showSliderBar,
                swatches,
                showOpacityControl,
            } = Object.assign({}, Colorx.defaultOptions, options);
        
            // Verifica si se proporciona un nombre de plantilla y si está disponible
            if (template === undefined) return console.error('Missing [template] property value');
            else if (template !== 'none') {
                if (typeof template !== 'string') return console.error('Expected a string value for the [template] property');
                else if (!document.querySelector('link.Colorx-Template[name=' + template + ']')) return console.error('Unable to find or load the specified stylesheet template');
            };
        
            // Registro de componentes y módulo de color
            const componentsRegister = {};
            const ColorModule = createColorModule();

            // Selecciona el contenedor DOM
            container = document.querySelector(container);
            if (!container) return console.error('Container not found');
            
            container.innerHTML = '';
            container.className = 'clx-container';

            // Crea el contenedor principal de Colorx
            const box = document.createElement('div');
            box.classList.add('clx-box');
            box.classList.add(alwaysOpen ? 'clx-open-box' : 'clx-close-box');
            componentsRegister['box'] = box;

            // Método para suscribirse a actualizaciones de color
            this.updating = (callback) => {
                ColorModule.registerCallback(callback);
            };

            // Método para suscribirse a cambios en los controles de color
            const changes = [];
            this.changing = (callback) => {
                changes.push(callback);
            };

            // Verifica si el contenedor siempre está abierto
            if (typeof alwaysOpen !== 'boolean') return console.error('Expected a boolean value for the [alwaysOpen] property');
            if (!alwaysOpen) {
                // Define métodos para abrir y cerrar el contenedor si no está siempre abierto
                this.open = () => {
                    box.classList.remove('clx-close-box');
                    box.classList.add('clx-open-box');
                };
                this.close = () => {
                    box.classList.remove('clx-open-box');
                    box.classList.add('clx-close-box');
                };
            };

            // Verifica si se deben mostrar los formatos de color
            if (typeof showFormats !== 'boolean') return console.error('Expected a boolean value for the [showFormats] property');
            if (showFormats) {
                // Crea y agrega el control de formatos
                const module = createFormatControl(changes, ColorModule);
                module.init((component) => {
                    box.appendChild(component);
                    componentsRegister['format-control'] = component;
                });
                // Actualiza el valor del formato seleccionado
                this.updating((color) => {
                    if (module.status === 'output') 
                    module.value = color[module.format];
                });
                // Método para suscribirse a cambios en la escritura del color
                this.writing = (callback) => {
                    module.registerCallback(callback);
                    return callback;
                };
            };

            // Verifica si se debe mostrar una vista previa del color
            if (typeof showPreview !== 'boolean') return console.error('Expected a boolean value for the [showPreview] property');
            if (numberOfPickers <= 0 || showPreview) {
                // Agrega la vista previa del color principal
                const { element } = ColorModule.preview;
                element.classList.add('clx-preview');
                element.classList.add('clx-primary-preview');
                box.appendChild(element);
                componentsRegister['primary-preview'] = element;
            };

            // Verifica y maneja la cantidad máxima de colores recientes
            if (typeof lastestColorLimit !== 'number') return console.error('Expected a number value for the [lastestColorLimit] property');
            if (lastestColorLimit) {
                // Crea y maneja la lista de colores recientes
                const lastestColorsList = [];
                const lastestColorCallbacks = [];
                this.updatingLastestColors = (callback) => {
                    lastestColorCallbacks.push(callback);
                };
                const { component, viewers } = createListColors(lastestColorLimit, changes, ColorModule);
                component.classList.add('clx-lastest-colors');
                box.appendChild(component);
                componentsRegister['lastest-colors'] = component;
                this.changing((color) => {
                    if (!color) return;
                    else if (viewers.some(v => getComputedStyle(v).backgroundColor === color.rgb)) return;
                    viewers
                    .reduce((a, e) => {
                        a.unshift(e);
                        return a;
                    }, [])
                    .forEach((e, i, a) => {
                        if (i < a.length - 1) e.style.backgroundColor = getComputedStyle(a[i + 1]).backgroundColor;
                        else e.style.backgroundColor = color.rgb;
                    });
                    lastestColorsList.push({ ...color });
                    while (lastestColorsList.length >= lastestColorLimit)
                    lastestColorsList.pop();
                    lastestColorCallbacks.forEach(e => e(lastestColorsList));
                });
            };

            // Verifica y maneja la cantidad máxima de colores favoritos
            if (typeof favoriteColorLimit !== 'number') return console.error('Expected a number value for the [favoriteColorLimit] property');
            if (favoriteColorLimit) {
                // Crea y maneja la lista de colores favoritos
                const favoritesList = [];
                const favoritesCallbacks = [];
                this.updatingFavorites = (callback) => {
                    favoritesCallbacks.push(callback);
                };
                const { component, viewers } = createListColors(favoriteColorLimit, changes, ColorModule);
                const addButton = document.createElement('button');
                addButton.classList.add('clx-add-favorite');
                const add = () => {
                    if (!viewers.find(e => getComputedStyle(e).backgroundColor === ColorModule.value.rgb)) {
                        viewers
                        .reduce((a, e) => {
                            a.unshift(e);
                            return a;
                        }, [])
                        .forEach((e, i, a) => {
                            if (i > 0)
                                a[i - 1].style.backgroundColor = getComputedStyle(e).backgroundColor;
                        });
                        viewers[0].style.backgroundColor = ColorModule.value.rgb;
                        favoritesList.push({ ...ColorModule.value });
                        while (favoritesList.length >= favoriteColorLimit)
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
                    while (favoritesList.length > 0)
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

            // Registra los controladores de eventos de deslizamiento
            const sliderRegister = [];
            this.sliderDrag = (callback) => {
                sliderRegister.push(callback);
            };

            // Verifica el tipo de espectro y crea el control correspondiente
            if (typeof spectrumType !== 'string') return console.error('Expected a string value for the [spectrumType] property');
            spectrumType = spectrumType.toLowerCase().trim();
            if (spectrumType !== 'none') {
                let spectrum;
                if (spectrumType === 'clasic')
                spectrum = createClasicSpectrum(changes, sliderRegister, ColorModule);
                else if (spectrumType === 'circle')
                spectrum = createCircleSpectrum(changes, sliderRegister, ColorModule);
                else {
                    console.error('[spectrumType] property not found. Try [clasic or circle] value');
                    return;
                };
                box.appendChild(spectrum.component);
                componentsRegister['spectrum'] = spectrum.spectrumElement;
                componentsRegister['hue-spectrum-control'] = spectrum.slider;
                this.updating((color) => {
                    if (spectrum.status === 'output') {
                        spectrum.draw(color.values.hue);
                        spectrum.synchronize();
                    };
                });
                // Método para suscribirse a eventos de navegación en el espectro de colores
                this.navigating = (callback) => {
                    spectrum.callbacks.push(callback);
                };
            };

            // Verifica si se debe mostrar la barra deslizante
            if (typeof showSliderBar !== 'boolean') return console.error('Expected a boolean value for the [showSliderBar] property');
            if (showSliderBar) {
                // Crea y maneja la barra deslizante
                const { component, sliders } = createSliderBar(ColorModule, changes);
                this.changing((color) => {
                    for (const slider in sliders) {
                        const value = color.values[slider] * 100 / sliders[slider].max;
                        sliders[slider].thumb.style.left = value * (sliders[slider].element.clientWidth - sliders[slider].thumb.offsetWidth) / 100 + 'px';
                        sliders[slider].thumb.style.top = value * (sliders[slider].element.clientHeight - sliders[slider].thumb.offsetHeight) / 100 + 'px';
                    };
                });
                for (const slider in sliders) {
                    componentsRegister[`${slider}-control`] = sliders[slider].element;
                    sliders[slider].isDrag((x, y) => {
                        sliderRegister.forEach(e => e({
                            name: `${slider} control`,
                            value: x | y,
                            x: sliders[slider].thumb.getBoundingClientRect().left,
                            y: sliders[slider].thumb.getBoundingClientRect().top
                        }, ColorModule.value));
                    });
                };
                box.appendChild(component);
                componentsRegister['slider-bar'] = component;
            };

            // Verifica si se han proporcionado colores predefinidos
            if (swatches.length === undefined) return console.error('Expected an array value for the [swatches] property');
            if (swatches.length > 0) {
                // Crea y maneja la lista de colores predefinidos
                const { component, viewers } = createListColors(swatches.length, changes, ColorModule);
                component.classList.add('clx-swatches');
                viewers.forEach((e, i) => e.style.backgroundColor = swatches[i]);
                box.appendChild(component);
                componentsRegister['swatches'] = component;
            };

            // Verifica si se debe mostrar el control de opacidad
            if (typeof showOpacityControl !== 'boolean') return console.error('Expected a boolean value for the [showOpacityControl] property');
            if (showOpacityControl) {
                // Crea y maneja el control de opacidad
                const opacityControl = createSlider(200);
                opacityControl.element.className = 'clx-opacity-control';
                let status = 'output';
                opacityControl.isDrag((x, y) => {
                    let status = 'input';
                    opacityControl.thumb.style.transition = 'none';
                    const value = (x | y) / 100;
                    const { red, blue, green } = ColorModule.value.values;
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
                    if (status === 'output') {
                        const { alpha } = color.values;
                        const value = alpha * 100;
                        opacityControl.thumb.style.transition = 'left .5s, top .5s';
                        opacityControl.thumb.style.left = value * (opacityControl.element.clientWidth - opacityControl.thumb.offsetWidth) / 100 + 'px';
                        opacityControl.thumb.style.top = value * (opacityControl.element.clientHeight - opacityControl.thumb.offsetHeight) / 100 + 'px';
                    };
                });
            };

            // Verifica y maneja la cantidad de selectores de color
            if (typeof numberOfPickers !== 'number') return console.error('Expected a number value for the [numberOfPickers] property');
            for (let i = 0; i < numberOfPickers; i += 1) {
                // Crea y maneja los selectores de color
                const picker = createViewer();
                const selectPicker = (event) => {
                    event.preventDefault();
                    if (ColorModule.picker === picker.fill) {
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
            // Agrega el contenedor principal al contenedor DOM
            container.appendChild(box);

            // Método para cambiar el color externamente
            this.change = (string, callback) => {
                ColorModule.value = string;
                changes.forEach(e => e(ColorModule.value));
                if (typeof callback === 'function')
                callback(ColorModule.value);
                else return ColorModule.value;
            };

            // Método para acceder a los componentes de Colorx
            this.components = (name, callback) => {
                if (name === '*') callback(componentsRegister);
                else if (name === 'foreach') {
                    for (const component in componentsRegister) {
                        callback(componentsRegister[component]);
                    };
                } else if (componentsRegister.hasOwnProperty(name))
                callback(componentsRegister[name]);
                else console.error(name + ' is not found');
            };

            // Método para suscribirse a eventos de Colorx
            this.on = (event, callback) => {
                switch (event) {
                    case 'change':
                    this.changing((a) => callback(a));
                    break;
                    case 'update':
                    this.updating((a, b) => callback(a, b));
                    break;
                    case 'write':
                    if (this.writing)
                        this.writing((a, b) => callback(a, b));
                    break;
                    case 'navigate':
                    this.navigating((a, b) => callback(a, b));
                    break;
                    case 'slider-drag':
                    this.sliderDrag((a, b) => callback(a, b));
                    break;
                    case 'update-favorites':
                    if (this.updatingFavorites)
                        this.updatingFavorites((a) => callback(a));
                    break;
                    case 'update-lastest-colors':
                    if (this.updatingLastestColors)
                        this.updatingLastestColors((a) => callback(a));
                    break;
                    default:
                    console.error(event + ' is not a valid argument')
                    break;
                };
            };

            // Método para obtener el valor de un color seleccionado
            this.selected = (string, callback) => {
                if (string === '*') {
                    if (typeof callback === 'function')
                    callback(ColorModule.value);
                    else return ColorModule.value;
                };
                const all = { ...ColorModule.value, ...ColorModule.value.values };
                if (all.hasOwnProperty(string)) {
                    if (typeof callback === 'function')
                    callback(all[string]);
                    else return all[string];
                } else console.error(string + ' not found');
            };
        
            // Verifica si se ha especificado una plantilla y, si es así, aplica esa plantilla a todos los elementos dentro del componente, incluidos los descendientes.
            if (template !== 'none') {
                // Selecciona todos los elementos dentro del contenedor que coinciden con el selector '*'.
                const allElements = container.querySelectorAll('*');
    
                // Itera sobre cada elemento seleccionado.
                allElements.forEach(element => {
                    // Establece el atributo 'template' en el elemento actual con el valor de la variable 'template'.
                    element.setAttribute('template', template);
                });
            };
        };
    };
})();

export default Colorx;
