// Data store for nodes and connections
const nodes = [
  { id: 'box1', x: 50, y: 500, width: 100, height: 80, text: 'Sign Up', color: 'cornflowerblue' },
  { id: 'box2', x: 200, y: 500, width: 100, height: 80, text: 'Log In', color: 'crimson' },
  { id: 'box3', x: 350, y: 500, width: 100, height: 80, text: 'Landing Page', color: 'mediumseagreen' },
  { id: 'box4', x: 500, y: 400, width: 100, height: 80, text: 'Password Reset', color: 'orange' },
  { id: 'box5', x: 500, y: 600, width: 100, height: 80, text: 'Shopping Cart', color: 'orange' }
];

const connections = [
  { id: 'arrow1', from: 'box1', to: 'box2' },
  { id: 'arrow2', from: 'box2', to: 'box3' },
  { id: 'arrow3', from: 'box3', to: 'box4' },
  { id: 'arrow4', from: 'box3', to: 'box5' }
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
  draggable: false,
});

// Add it to the layer FIRST so it stays in the background
bgLayer.add(bgRect)

stage.draggable(false);

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
    id: `${data.id}-rect`,
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
    id: conn.id,
    x: 0,
    y: 0,
    points: [0, 0, 0, 0],
    pointerLength: 0,
    pointerWidth: 0,
    dash: [12, 8],
    fill: 'green',
    stroke: 'green',
    strokeWidth: 4,
  });

  bgLayer.add(arrow);
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
numPrinciples = 3;


principle1List = [1, 1, 0, 0];
principle2List = [1, 0, 0, 1];
principle3List = [0, 0, 1, 1];

const principleLists = {
  1: principle1List,
  2: principle2List,
  3: principle3List,
};

const principleStates = {
  1: true,
  2: true,
  3: true,
};

function updateAllArrowColors() {
  for (let i = 0; i < connections.length; i++) {
    const arrow = arrowMap.get(connections[i].id).arrow;

    let associatedCount = 0;
    let allTrue = true;

    for (let j = 1; j <= numPrinciples; j++) {
      const list = principleLists[j];
      if (list && list[i] == 1) {
        associatedCount++;
        if (!principleStates[j]) {
          allTrue = false;
        }
      }
    }

    // Skip arrows with no associated principles, or color green only when every linked principle is true
    if (associatedCount === 0) continue;

    const targetColor = allTrue ? 'green' : 'red';
    arrow.to({
      fill: targetColor,
      stroke: targetColor,
      duration: 1,
    });
  }
}

function Togglebutton(principleNum) {
  if (!(principleNum in principleStates)) return;

  principleStates[principleNum] = !principleStates[principleNum];
  updateAllArrowColors();
}

const flowAnim = new Konva.Animation((frame) => {
  const offset = -(frame.time / 1000) * 40;
  for (const conn of connections) {
    arrowMap.get(conn.id)?.arrow.dashOffset(offset);
  }
}, bgLayer);

flowAnim.start();

