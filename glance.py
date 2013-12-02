# -*- coding: UTF-8 -*-

from flask import Flask, render_template, request, redirect, Response
import json, os, sys

app = Flask(__name__)

### ---------------------------- Functions ---------------------------- ###

print '# loading json ...',
sys.stdout.flush()
bnc_pos  = json.load(open('static/data/bnc.word.filter.json'))
bnc_test = json.load(open('static/data/bnc.word.test.json'))
print 'done.'

### ---------------------------- UI ---------------------------- ###

@app.route('/')
def hello():
    return render_template('index.html')

@app.route("/pos")
@app.route("/pos/")
def show_pos():
	return render_template('pos.html')


@app.route("/test")
@app.route("/test/")
def show_test():
	return render_template('test.html')

### ---------------------------- API ---------------------------- ###
### pos API

@app.route('/api/pos/<query>')
def pos_count(query):
	return_data = [] if query not in bnc_pos else bnc_pos[query]
	if return_data:
		r = []
		for x in return_data:
			p = x[2]*100
			p = "%.2f" % p
			r.append((x[0], x[1], p))
		return_data = r
	return Response(json.dumps(return_data), mimetype='application/json')

### test API
@app.route('/api/test/<query>')
def test_level(query):
	return_data = [] if query not in bnc_test else bnc_test[query]
	return Response(json.dumps(return_data), mimetype='application/json')

if __name__ == "__main__":
	# app.debug = True
	app.run(host="0.0.0.0")