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
  canvas.add(new fabric.Text(object['text'], {
    left: object['left'],
    top: object['top'],
  }));
}

window.onload = function() {
  // キャンバスの初期設定
  const canvasinit = function(){
    // キャンバス取得
    const canvas = new fabric.Canvas('canvas', {
      backgroundColor: 'rgb(241,241,241)',
    });

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
        case 'rectangle':
          console.log('rectangle');
          break;
        default:
          console.log(object['type']);
      }

      console.log(`${key}: ${object}`);
    }
  }
  // 初期処理で実行
  canvasinit();
};

