from flask import Flask, request,redirect, render_template, url_for, jsonify



app = Flask(__name__)

@app.route('/')
def index():
    return render_template('dash.j2')


if __name__ == '__main__':
    app.run(debug=True)
