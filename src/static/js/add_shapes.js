// 四角形を追加
const addRectangle = function (canvas, object) {
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
// 円を追加
const addCircle = function (canvas, object) {
  canvas.add(new fabric.Circle({
    left: object['left'],
    top: object['top'],
    radius: object['radius'],
    originX: 'center',
    originY: 'center',
    fill: 'rgb(255,255,255)',
    stroke: "rgb(0,0,0)",
    strokeWidth: 3,
    strokeUniform: true,
  }));
}
// 線を追加
const addLine = function (canvas, object) {
  canvas.add(new fabric.Line([object['left'], object['top'], object['width'], object['height']], {
    fill: 'rgb(255,255,255)',
    stroke: "rgb(0,0,0)",
    strokeWidth: 3,
    strokeUniform: true,
  }));
}
// 文字を追加
const addText = function (canvas, object) {
  canvas.add(new fabric.Textbox(object['text'], {
    left: object['left'],
    top: object['top'],
    fontFamily: 'M PLUS 1p'
  }));
}
// 矢印の先の三角形の角度を算出
const calcArrowAngle = function (line) {
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
// 矢印を追加
const addArrowLine = function (canvas, object) {
  var line, arrow;
  line = new fabric.Line([object['left'], object['top'], object['width'], object['height']], {
    fill: 'rgb(255,255,255)',
    stroke: "rgb(0,0,0)",
    strokeWidth: 3,
    strokeUniform: true,
    selectable: true,
    padding: 5,
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
  // 回転時
  const moveEnd = function (obj) {
    var p = obj, x1, y1, x2, y2;
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
  // 移動時
  const moveLine = function () {
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
  arrow.on('moving', function () {
    moveEnd(arrow);
  });
  line.on('moving', function () {
    moveLine();
  });
}
