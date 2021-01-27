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

const tools = {
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
    canvas.mousePressed(msClicked);

    textTool = createButton('T');
    textTool.mousePressed(textToolBtn);

    selectTool = createButton('S');
    selectTool.mousePressed(selectToolBtn);

    radio = createRadio();
    radio.style('width', 'auto');
    radio.changed(radioUpdate);

}

function draw() {
    background(220);
    if (layers.length > 0) {
        layers.forEach((layer, index) => {
            layer.draw();
            if (!radio.selected(`${index}`)) {
                radio.option(index, index + " - " + layer.params.text);
            }
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
    tool.start();
}

function selectToolBtn() {
    tool = tools.selection;
    tool.start();
}

function selectLayer() {
    layers[radio.value()? radio.value().charAt(0) : 0].params.position = createVector(mouseX, mouseY);
    layerHighlight();
}

function layerHighlight(removeAll) {
    layers.forEach(layer => {
        layer.params.stroke = 0;
    });
    if (removeAll != true) {
        layers[radio.value()? radio.value().charAt(0) : 0].params.stroke = 5;
    }
}

function createText(x, y) {
    
    tools.text.params.position = createVector(x, y);

    let layer = { 
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
    radio.value(`${layers.length}`);
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
    tools.text.params.text = textInput.value();
}

function textToolStart() {
    resetElements();
    fontSelect = createSelect();
    fonts.forEach(font => {
        fontSelect.option(font);
    })
    fontSelect.changed(fontSelected);

    colorSelect = createColorPicker('black');
    colorSelect.changed(colorSelected);

    sizeSelect = createSlider(1, 100, 50);
    sizeSelect.changed(sizeSelected);

    textInput = createInput('word')
    textInput.input(textInputed);

    layerHighlight(true);
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
