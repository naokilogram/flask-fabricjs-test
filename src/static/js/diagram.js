const grid = 10;
let mostLeft = null;
let mostRight = null;
let mostTop = null;
let mostBottom = null;

// 最末端の座標を計算
const calcMostEnd = function (left, right, top, bottom) {
  if (mostLeft == null) { mostLeft = left }
  if (mostRight == null) { mostRight = right }
  if (mostTop == null) { mostTop = top }
  if (mostBottom == null) { mostBottom = bottom }
  mostLeft = mostLeft < left ? mostLeft : left;
  mostRight = mostRight > right ? mostRight : right;
  mostTop = mostTop < top ? mostTop : top;
  mostBottom = mostBottom > bottom ? mostBottom : bottom;
  console.log('right:' + mostRight);
  console.log('bottom:' + mostBottom);
}

// 座標を四捨五入
const roundCoordinates = function (object) {
  if (object['top'] !== undefined) {
    object['top'] = Math.round(object['top'] / grid) * grid;
  }
  if (object['left'] !== undefined) {
    object['left'] = Math.round(object['left'] / grid) * grid;
  }
  if (object['height'] !== undefined) {
    object['height'] = Math.round(object['height'] / grid) * grid;
  }
  if (object['width'] !== undefined) {
    object['width'] = Math.round(object['width'] / grid) * grid;
  }
  if (object['radius'] !== undefined) {
    object['radius'] = Math.round(object['radius'] / grid) * grid;
  }
}

// 最端を計算
const calcEndPoints = function (object) {
  switch (object['type']) {
    case 'rectangle':
      calcMostEnd(object['left'], object['left'] + object['width'], object['top'], object['top'] + object['height']);
    case 'line':
      calcMostEnd(object['left'], object['width'], object['top'], object['height']);
      break;
    case 'circle':
      calcMostEnd(object['left'] - object['radius'], object['left'] + object['radius'],
        object['top'] - object['radius'], object['top'] + object['radius']);
      break;
    case 'text':
      break;
    case 'arrow':
      break;
    default:
  }
}

window.onload = function () {
  // キャンバスの初期設定
  const canvasinit = function () {
    // キャンバス取得
    const canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      backgroundColor: 'rgb(241,241,241)',
    });
    // グリッドを作成
    for (var i = 0; i < (1000 / grid); i++) {
      color = (i % 10 === 0) ? '#aaa' : '#ccc';
      canvas.add(new fabric.Line([i * grid, 0, i * grid, 600], {
        stroke: color,
        selectable: false
      }));
      canvas.add(new fabric.Line([0, i * grid, 1000, i * grid], {
        stroke: color,
        selectable: false
      }))
    }
    // 座標を四捨五入
    for (const [key, object] of Object.entries(result)) {
      roundCoordinates(object);
    }
    // 最端座標を計算
    for (const [key, object] of Object.entries(result)) {
      calcEndPoints(object);
    }
    // 図形を配置
    for (const [key, object] of Object.entries(result)) {
      switch (object['type']) {
      case 'rectangle':
        addRectangle(canvas, object)
        break;
      case 'circle':
        addCircle(canvas, object)
        break;
      case 'line':
        addLine(canvas, object)
        break;
      case 'text':
        addText(canvas, object)
        break;
      case 'arrow':
        addArrowLine(canvas, object)
        break;
      default:
        console.log(object['type']);
      }
    }
    // グリッドにスナップ
    canvas.on('object:moving', function (options) {
      options.target.set({
        left: Math.round(options.target.left / grid) * grid,
        top: Math.round(options.target.top / grid) * grid
      });
    });
    // Deleteボタン押下
    $('#delete-btn').click(function () {
      canvas.remove(canvas.getActiveObject());
    })
    // Rectangleボタン押下
    $('#rectangle-btn').click(function () {
      addRectangle(canvas, {"left": 0, "top": 0, "width": 150, "height": 100})
    })
    // Circleボタン押下
    $('#circle-btn').click(function () {
      addCircle(canvas, {"left": 0, "top": 0, "radius": 100})
    })
    // Textボタン押下
    $('#text-btn').click(function () {
      addText(canvas, {"text": "New Text", "left": 0, "top": 0, "width": 150, "height": 100})
    })
    // Lineボタン押下
    $('#line-btn').click(function () {
      addLine(canvas, {"left": 0, "top": 0, "width": 150, "height": 100})
    })
    // Arrow Lineボタン押下
    $('#arrow-btn').click(function () {
      addArrowLine(canvas, {"left": 10, "top": 10, "width": 150, "height": 100})
    })
    // Download As Imageボタン押下
    $('#download-btn').click(function () {
      let canvas = document.getElementById("canvas");
      let link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "test.png";
      link.click();
    });
  }
  // 初期処理で実行
  canvasinit();
};