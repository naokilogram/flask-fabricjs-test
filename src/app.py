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
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
