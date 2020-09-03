const calcArrowAngle = function(line) {
  x1 = line.get('x1');
  y1 = line.get('y1');
  x2 = line.get('x2');
  y2 = line.get('y2');

  var angle = 0, x, y;

  x = (x2 - x1);
  y = (y2 - y1);

  if (x === 0) {
    angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
  } else if (y === 0) {
    angle = (x > 0) ? 0 : Math.PI;
  } else {
    angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
  }

  return (angle * 180 / Math.PI);
}

const addRect = function(canvas, object) {
  canvas.add(new fabric.Rect({
  left: object['left'],
  top: object['top'],
  width: object['width'],
  height: object['height'],
  fill: 'rgb(255,255,255)',
  stroke: "rgb(0,0,0)",
  strokeWidth: 3,
  strokeUniform: true,
  }));
}

const addLine = function(canvas, object) {
  canvas.add(new fabric.Line([object['left'], object['top'], object['width'], object['height']], {
  fill: 'rgb(255,255,255)',
  stroke: "rgb(0,0,0)",
  strokeWidth: 3,
  strokeUniform: true,
  }));
}

const addText = function(canvas, object) {
  canvas.add(new fabric.Textbox(object['text'], {
  left: object['left'],
  top: object['top'],
  }));
}

const addArrow = function(canvas, object) {
  var line, arrow;

  line = new fabric.Line([object['left'], object['top'], object['width'], object['height']], {
    stroke: '#000',
    selectable: true,
    strokeWidth: '3',
    padding: 5,
    hasBorders: false,
    hasControls: false,
    originX: 'center',
    originY: 'center',
    lockScalingX: true,
    lockScalingY: true
  });

  const centerX = (line.x1 + line.x2) / 2, centerY = (line.y1 + line.y2) / 2;
  const deltaX = line.left - centerX, deltaY = line.top - centerY;

  arrow = new fabric.Triangle({
    left: line.get('x2') + deltaX,
    top: line.get('y2') + deltaY,
    originX: 'center',
    originY: 'center',
    hasBorders: false,
    hasControls: false,
    lockRotation: true,
    pointType: 'arrow_start',
    angle: calcArrowAngle(line) + 90,
    width: 20,
    height: 20,
    fill: '#000'
  });
  arrow.line = line;

  line.customType = arrow.customType = 'arrow';
  line.arrow = arrow;

  canvas.add(line, arrow);

  const moveEnd = function(obj) {
    var p = obj,
    x1, y1, x2, y2;

    if (obj.pointType === 'arrow_start') {
      obj.line.set('x2', obj.get('left'));
      obj.line.set('y2', obj.get('top'));
    } else {
      obj.line.set('x1', obj.get('left'));
      obj.line.set('y1', obj.get('top'));
    }

    obj.line._setWidthHeight();

    angle = calcArrowAngle(obj.line);

    if (obj.pointType === 'arrow_end') {
      obj.arrow.set('angle', angle + 90);
    } else {
      obj.set('angle', angle + 90);
    }

    obj.line.setCoords();
    canvas.renderAll();
  }

  const moveLine = function() {
    var oldCenterX = (line.x1 + line.x2) / 2,
    oldCenterY = (line.y1 + line.y2) / 2,
    deltaX = line.left - oldCenterX,
    deltaY = line.top - oldCenterY;

    line.arrow.set({
    'left': line.x2 + deltaX,
    'top': line.y2 + deltaY
    }).setCoords();

    line.set({
    'x1': line.x1 + deltaX,
    'y1': line.y1 + deltaY,
    'x2': line.x2 + deltaX,
    'y2': line.y2 + deltaY
    });

    line.set({
    'left': (line.x1 + line.x2) / 2,
    'top': (line.y1 + line.y2) / 2
    });
  }

  arrow.on('moving', function() {
    moveEnd(arrow);
  });

  line.on('moving', function() {
    moveLine();
  });
}

window.onload = function() {
  // キャンバスの初期設定
  const canvasinit = function(){
  // キャンバス取得
  const canvas = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    backgroundColor: 'rgb(241,241,241)',
  });

  // グリッドを作成
  const grid = 10;
  for (var i = 0; i < (800 / grid); i++) {
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#ccc', selectable: false }));
    canvas.add(new fabric.Line([ 0, i * grid, 800, i * grid], { stroke: '#ccc', selectable: false }))
  }

  // 図形を配置
  for (const [key, object] of Object.entries(result)) {
    switch (object['type']) {
    case 'rectangle':
      addRect(canvas, object)
      break;
    case 'line':
      addLine(canvas, object)
      break;
    case 'text':
      addText(canvas, object)
      break;
    case 'arrow':
      addArrow(canvas, object)
      break;
    default:
      console.log(object['type']);
    }
  }

  // グリッドにスナップ
  canvas.on('object:moving', function(options) {
    options.target.set({
    left: Math.round(options.target.left / grid) * grid,
    top: Math.round(options.target.top / grid) * grid
    });
  });
  }
  // 初期処理で実行
  canvasinit();
};

