const simpleTemplate = Colorx.create({
    container: '#container-1',
    template: 'simple',
    spectrumType: 'clasic',
    showSliderBar: true
});

simpleTemplate.on('update', (color) => document.body.style.backgroundColor = color.rgb);

const modernTemplate = Colorx.create({
    container: '#container-2',
    template: 'modern',
    spectrumType: 'circle',
    showSliderBar: true
});

modernTemplate.on('update', (color) => document.body.style.backgroundColor = color.rgb);
