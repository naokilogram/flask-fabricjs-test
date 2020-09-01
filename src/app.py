from flask import Flask, render_template, url_for
import os

app = Flask(__name__)

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
      {'type': 'line', 'top': 100, 'left': 200, 'width': 350, 'height': 100},
      {'type': 'line', 'top': 150, 'left': 425, 'width': 425, 'height': 250},
      {'type': 'text', 'text': 'A', 'top': 75, 'left': 110},
      {'type': 'text', 'text': 'B', 'top': 75, 'left': 410},
      {'type': 'text', 'text': 'C', 'top': 280, 'left': 410},
    ]
    return render_template('index.html', result=result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
