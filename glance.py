# -*- coding: UTF-8 -*-

from flask import Flask, render_template, request, redirect, Response

app = Flask(__name__)

@app.route('/')
def hello():
	# return 'XD'
    return render_template('index.html')

if __name__ == "__main__":
	app.debug = True
	app.run(host="0.0.0.0")