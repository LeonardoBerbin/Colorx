const clasicTemplate = Colorx.create({
    container: '#container-1',
    template: 'simple',
    numberOfPickers: 3
});

clasicTemplate.on('update', (color) => document.body.style.backgroundColor = color.rgb)