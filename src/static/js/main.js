// キャンバスの共通オブジェクト
var canvas = null;

window.addEventListener("load", function(){
  // キャンバスの初期設定
  const canvasinit = function(){

    // キャンバス取得
    var canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      backgroundColor: 'rgb(211,211,211)',
    });

    // 手書きモードOK
    canvas.isDrawingMode = true;
    // 手書きの色
    canvas.freeDrawingBrush.color = "#000";
    // 手書きの太さ
    canvas.freeDrawingBrush.width = 5;

    // 描いた内容はクリア、画像はそのまま
    var init = document.getElementById("init");
    init.addEventListener("click", function(){
      // キャンバスクリア
      canvas.clear();
      // 画像を表示(上記onload処理にいく)
      img.src=FILENAME;
    });

  }
  // 初期処理で実行
  canvasinit();

  // ダウンロード処理
  var download = document.getElementById("download");
  download.addEventListener("click", function(){

    // ダウンロードファイル名指定
    this.setAttribute("download", "sample.jpg");
    // キャンバスのオブジェクト取得
    canvas = document.getElementById('canvas');
    // base64に変換
    var base64 = canvas.toDataURL("image/jpeg");
    // ダウンロード
    document.getElementById("download").href = base64;

  });
});