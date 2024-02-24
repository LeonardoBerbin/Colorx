// definir elementos del dom
const
templates = document.getElementById('templates'),
linesCode = document.getElementById('lines-code'),
selectTemplateInputs = document.querySelectorAll('input[name=select-template]'),
viewer = document.getElementById('viewer'),
copyButton = document.querySelectorAll('.code > button'),
canvas = document.querySelector('body > canvas');

// definir instancias de Colorx
const
simpleTemplate = Colorx.create({
    container: '#container-1',
    template: 'simple',
    numberOfPickers: 0,
    showSliderBar: true,
    spectrumType: 'clasic'
}),
modernTemplate = Colorx.create({
    container: '#container-2',
    template: 'modern',
    numberOfPickers: 0,
    showSliderBar: true,
    spectrumType: 'circle'
});

// definir objeto para gestionar los cambios de color y template con valores iniciales
const selected = {
    color: '#fff',
    template: 'simple',
    isOpen: true,
    set newColor(value){
        this.color = value;
        // ajustar color de la interfaz
        document.documentElement.style.setProperty('--color-2', value);
    },
    set newTemplate(value){
        // Sincronizar temolates
        switch (value) {
            case 'simple':
                simpleTemplate.change(this.color);
                break;
            default:
                modernTemplate.change(this.color);
        };
    }
};

// Asignar color al template inicial
simpleTemplate.change(selected.color);

// Abrir las instancias desde el codigo
simpleTemplate.open();
modernTemplate.open();

// Suscribir eventos updating para actualizar selected en cada actualizacion
simpleTemplate.updating((color) => selected.newColor = color.rgb);
modernTemplate.updating((color) => selected.newColor = color.rgb);

// Alternar templates
if(selectTemplateInputs)
selectTemplateInputs.forEach(e => {
    e.addEventListener('change', () => {
        // Desplazar los templates 
        templates.scrollLeft = templates.scrollLeft = (e.id === 'simple' ? templates.children[0] : templates.children[1]).offsetLeft - 3;
        // Desplazar las lineas de codigo de cada template
        linesCode.scrollLeft = (e.id === 'simple' ? templates.children[0] : templates.children[1]).offsetLeft;
        
        // Actualizar selected
        selected.newTemplate = e.id;
    });
});

// Asignar apertura y cierre de las instancias a el visor principal
viewer.addEventListener('click', () => {
    if(selected.isOpen){
        simpleTemplate.close();
        modernTemplate.close();
        selected.isOpen = false;
        return
    };
    
    simpleTemplate.open();
    modernTemplate.open();
    selected.isOpen = true;
});

// Asignar apertura y cierre de codigo de muestra para ancho de pantalla menor a 700px
const viewCode = document.getElementById('view-code');
if(viewCode)
viewCode.addEventListener('change', () => {
    document.querySelectorAll('.code').forEach(e => {
        if(viewCode.checked)
        e.style.display = 'flex';
        else 
        e.style.display = 'none';
    });
});

// Copiar codigo de muestra 
if(copyButton)
copyButton.forEach((e) => {
    e.addEventListener('click', () => {
        const code = document.querySelector('.' + e.className + ' + pre');
        const text = code.innerText;
        
        const textarea = document.createElement("textarea");
        textarea.value = text;
        
        document.body.appendChild(textarea);
        textarea.select();
        
        document.execCommand("copy");
        document.body.removeChild(textarea);
        
        // Mensaje de copiado temporal
        e.textContent = '¡copiado!'; 
        setTimeout(() => {
            e.textContent = 'copiar';
        }, 1000);
    });
});

// Gestionar trazos en el canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
let isDraw = true;

const draw = (event) => {
    if(!isDraw) return;
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX);
    const y = (event.clientY || event.touches[0].clientY);

    ctx.strokeStyle = selected.color;
    ctx.lineWidth = (canvas.width + canvas.height) / 2 / 100;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
};

// Eventos tactiles
document.addEventListener('mousemove', draw);
document.addEventListener('mouseup', () => ctx.beginPath());

// Eventos de raton
document.addEventListener('touchmove', draw);
document.addEventListener('touchend', () => ctx.beginPath());

// Limipiar Canvas
document.getElementById('clear-canvas').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
// Suspender trazado cuando se interactue con los selectore de colores o la caja de codigos de muetra 
simpleTemplate.components('box', (e) => {
    // Eventos tactiles
    e.addEventListener('touchstart', () => isDraw = false);
    e.addEventListener('touchend', () => isDraw = true);
    // Eventos de raton
    e.addEventListener('mousedown', () => isDraw = false);
    e.addEventListener('mouseup', () => isDraw = true);
});

modernTemplate.components('box', (e) => {
    // Eventos tactiles
    e.addEventListener('touchstart', () => isDraw = false);
    e.addEventListener('touchend', () => isDraw = true);
    // Eventos de raton
    e.addEventListener('mousedown', () => isDraw = false);
    e.addEventListener('mouseup', () => isDraw = true);
});

// caja de codigos de muestra 
linesCode.addEventListener('touchstart', () => isDraw = false);
linesCode.addEventListener('touchend', () => isDraw = true);

linesCode.addEventListener('mousedown', () => isDraw = false);
linesCode.addEventListener('mouseup', () => isDraw = true);

// cerrar bootloader
setTimeout(() => {
    document.getElementById('bootloader').style.display = 'none';
}, 3000);