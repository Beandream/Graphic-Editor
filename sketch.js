var layers = [];
const fonts = [
    "Arial",
    "Arial Arial",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamon",
    "Courier New",
    "Brush Script MT"
]

var tools = {
    selection: {
        action: selectLayer,
        start: selectToolStart,
    },
    text: {
        action: createText,
        start: textToolStart,
        params: {
            position: null,
            font: fonts[0],
            size: 50,
            color: "black",
            text: "word",
            stroke: 0
        }
    }
}
var tool;
var fontSelect;
var colorSelect;
var sizeSelect;
var textInput;
var textTool;
var selectTool;

var mouseDown = false;

var radio;

function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent('app');
    canvas.addClass('canvas');
    canvas.mousePressed(msClicked);

    radio = createRadio();
    radio.class('layer');
    radio.changed(radioUpdate);
    radio.parent('app');

    resetElements();
}

function draw() {
    background(220);
    if (layers.length > 0) {
        layers.forEach((layer, index) => {
            layer.draw();
        })
    }
    if (tool == tools.selection) {
        if (mouseIsPressed && mouseDown == true) {
            selectLayer();
        }
    }
}

function radioUpdate() {
    layerHighlight();
}

function mouseReleased() {
    mouseDown = false;
}

function msClicked() {
    mouseDown = true;
    if (tool) {
        tool.action(mouseX, mouseY);
    }
}

function textToolBtn() {
    tool = tools.text;
}

function selectToolBtn() {
    tool = tools.selection;
    tool.start();
}

function selectLayer() {
    let info = nearestLayer();
    let nearest = info[0];
    let distance = info[1];

    let yDistance = nearest.params.position.y - mouseY;
    if (distance < nearest.params.text.length * 15) {
        if (nearest.params.stroke == 5) {
            nearest.params.position = createVector(mouseX, mouseY);
            layerHighlight(nearest);
        } else if (yDistance < nearest.params.size && yDistance > -nearest.params.size * 0.25) {
            nearest.params.position = createVector(mouseX, mouseY);
            layerHighlight(nearest);
        }
        tools.text.params = nearest.params;
        nearest.settings();
    } else {
        layers.forEach(layer => {
            layer.params.stroke = 0;
        });
        resetElements();
    }
    let value = layers.indexOf(nearest);
    setRadioOptions();
}

function setRadioOptions(command) {
    if (command === 'remove') {
        layers.forEach((layer, index) => {
            radio.remove(`${index + 1} ${layer.params.text}`);
        })
    } else if (command === 'set') {
        layers.forEach((layer, index) => {
            radio.remove(`${index + 1} ${layer.params.text}`);
        })
    
        layers.forEach((layer, index) => {
            radio.option(`${index + 1} ${layer.params.text}`);
        })
    }
    
}

function nearestLayer() {
    let nearest;
    let distance;
    layers.forEach(layer => {
        let pos = layer.params.position;
        if (createVector(mouseX, mouseY).dist(createVector(pos.x, pos.y)) < distance || !nearest) {
            nearest = layer;
            distance = createVector(mouseX, mouseY).dist(createVector(pos.x, pos.y));
        }
    });
    return [nearest, distance] ;
}

function layerHighlight(layer) {
    layers.forEach(layer => {
        layer.params.stroke = 0;
    });
    if (layer) {
        layer.params.stroke = 5;
    }
}

function createText(x, y) {
    
    tools.text.params.position = createVector(x, y);

    let layer = { 
        settings: function() {
            textToolStart();
        },
        draw: function() {
            stroke(255, 255, 200);
            strokeWeight(this.params.stroke);
            textAlign(CENTER);
            textSize(this.params.size);
            textFont(this.params.font);
            fill(this.params.color);
            text(this.params.text, this.params.position.x, this.params.position.y);
        },
        params: {...tool.params}
    }
    layers.push(layer);
    radio.option(layers.length + ' ' + layer.params.text);
    selectToolBtn();
    mouseDown = false;
}


function fontSelected() {
    tools.text.params.font = fontSelect.value();
}

function colorSelected() {
    tools.text.params.color = colorSelect.value();
}

function sizeSelected() {
    tools.text.params.size = sizeSelect.value();
}

function textInputed() {
    setRadioOptions('remove');
    tools.text.params.text = textInput.value();
    setRadioOptions('set');
}

function textToolStart() {
    resetElements();
    fontSelect = createSelect();
    fonts.forEach(font => {
        fontSelect.option(font);
    })
    fontSelect.changed(fontSelected);

    colorSelect = createColorPicker(tools.text.params.color);
    colorSelect.changed(colorSelected);

    sizeSelect = createSlider(1, 100, tools.text.params.size);
    sizeSelect.changed(sizeSelected);

    textInput = createInput(tools.text.params.text)
    textInput.input(textInputed);
}

function selectToolStart() {
    resetElements();
}

function resetElements() {
    removeElements();
    textTool = createButton('T');
    textTool.mousePressed(textToolBtn);

    selectTool = createButton('S');
    selectTool.mousePressed(selectToolBtn);

}