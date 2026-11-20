// Data store for nodes and connections
const nodes = [
  { id: 'box1', x: 50, y: 150, width: 100, height: 80, text: 'Box 1', color: 'cornflowerblue' },
  { id: 'box2', x: 350, y: 100, width: 100, height: 80, text: 'Box 2', color: 'crimson' },
  { id: 'box3', x: 200, y: 280, width: 100, height: 80, text: 'Box 3', color: 'mediumseagreen' }
];

const connections = [
  { id: 'arrow1', from: 'box1', to: 'box2' },
  { id: 'arrow2', from: 'box2', to: 'box3' }
];

// Create a stage (container for all layers)
const stage = new Konva.Stage({
  container: 'container',
  width: 1000,
  height: 1000,
});

// Create a layer
const bgLayer = new Konva.Layer();
const fgLayer = new Konva.Layer();
stage.add(bgLayer);
stage.add(fgLayer);

// Create a background rectangle that matches stage dimensions
const bgRect = new Konva.Rect({
  x: 0,
  y: 0,
  width: stage.width(),
  height: stage.height(),
  fill: '#848994',
  listening: false, // Prevents the background from blocking mouse events on shapes above it
});

// Add it to the layer FIRST so it stays in the background
bgLayer.add(bgRect);

const nodeMap = new Map(); // Quick lookup by ID: id -> Konva.Group
const arrowMap = new Map(); // Quick lookup by ID: id -> Konva.Arrow

// 1. Create Nodes (Boxes)
nodes.forEach(data => {
  const group = new Konva.Group({
    x: data.x,
    y: data.y,
    draggable: true,
  });

  const rect = new Konva.Rect({
    width: data.width,
    height: data.height,
    fill: data.color,
    cornerRadius: 4,
    shadowBlur: 5,
  });

  const label = new Konva.Text({
    text: data.text,
    width: data.width,
    height: data.height,
    align: 'center',
    verticalAlign: 'middle',
    fill: 'white',
    fontSize: 14,
  });

  group.add(rect);
  group.add(label);
  fgLayer.add(group);

  // Store reference
  nodeMap.set(data.id, group);

  // Rerender arrows whenever ANY box moves
  group.on('dragmove', updateAllArrows);
});

// 2. Create Arrows
connections.forEach(conn => {
  const arrow = new Konva.Arrow({
    x: 0,
    y: 0,
    points: [0, 0, 0, 0],
    pointerLength: 12,
    pointerWidth: 12,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
  });
  
  fgLayer.add(arrow);
  arrowMap.set(conn.id, { arrow, from: conn.from, to: conn.to });
});

// 3. Central update function
function updateAllArrows() {
  arrowMap.forEach(({ arrow, from, to }) => {
    const fromNode = nodeMap.get(from);
    const toNode = nodeMap.get(to);

    if (!fromNode || !toNode) return;

    // Calculate center points based on group positions
    const x1 = fromNode.x() + 50; // Half of width (100 / 2)
    const y1 = fromNode.y() + 40; // Half of height (80 / 2)
    
    const x2 = toNode.x() + 50;
    const y2 = toNode.y() + 40;

    arrow.points([x1, y1, x2, y2]);
  });
}

// Initial draw
updateAllArrows();

stage.draggable('true');