from flask import Flask, render_template, url_for, request, redirect, send_from_directory, session
from werkzeug.utils import secure_filename
import os
app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = os.urandom(24)

def allowed_file(filename):
  return '.' in filename and \
    filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# ここから -- 読み込むcssやjsのファイル名にq=<ファイルの更新日時>をつけるハック
@app.context_processor
def override_url_for():
  return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
  if endpoint == 'static':
    filename = values.get('filename', None)
    if filename:
      file_path = os.path.join(app.root_path,
                               endpoint, filename)
      values['q'] = int(os.stat(file_path).st_mtime)
  return url_for(endpoint, **values)
# 読み込むcssやjsのファイル名にq=<ファイルの更新日時>をつけるハック -- ここまで

@app.route('/')
def index():
  result = [
    {'type': 'rectangle', 'top': 50, 'left': 50, 'width': 150, 'height': 100},
    {'type': 'rectangle', 'top': 50, 'left': 350, 'width': 150, 'height': 100},
    {'type': 'rectangle', 'top': 250, 'left': 350, 'width': 150, 'height': 100},
    {'type': 'line', 'top': 150, 'left': 400, 'width': 400, 'height': 250},
    {'type': 'arrow', 'top': 100, 'left': 200, 'width': 350, 'height': 100},
    {'type': 'arrow', 'top': 150, 'left': 425, 'width': 425, 'height': 250},
    {'type': 'text', 'text': 'A', 'top': 75, 'left': 110},
    {'type': 'text', 'text': 'B', 'top': 75, 'left': 410},
    {'type': 'text', 'text': 'C', 'top': 280, 'left': 410},
  ]
  return render_template('index.html', result=result)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
  # リクエストがポストかどうかの判別
  if request.method == 'POST':
    # ファイルがなかった場合の処理
    if 'file' not in request.files:
      flash('ファイルがありません')
      return redirect(request.url)
    # データの取り出し
    file = request.files['file']
    # ファイル名がなかった時の処理
    if file.filename == '':
      flash('ファイルがありません')
      return redirect(request.url)
    # ファイルのチェック
    if file and allowed_file(file.filename):
      # 危険な文字を削除（サニタイズ処理）
      filename = secure_filename(file.filename)
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      return redirect(url_for('index', filename=filename))
  else:
    return render_template('upload.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
