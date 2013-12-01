# -*- coding: UTF-8 -*-

from flask import Flask, render_template, request, redirect, Response
import json, os, sys

app = Flask(__name__)


### ---------------------------- Functions ---------------------------- ###
def load_json(): return json.load(open('static/data/bnc.word.filter.json'))
# print os.getcwd()
# raw_input()
print '# loading bnc.word.filter.json ...',
sys.stdout.flush()
js = load_json()
print 'done.'

### ---------------------------- UI ---------------------------- ###

@app.route('/')
def hello():
    return render_template('index.html')

@app.route("/pos")
@app.route("/pos/")
def pos():
	return render_template('pos.html')



### ---------------------------- API ---------------------------- ###
# pos API
@app.route('/api/pos/<query>')
def pos_count(query):
	return_data = [] if query not in js else js[query]
	if return_data:
		r = []
		for x in return_data:
			p = x[2]*100
			p = "%.2f" % p
			r.append((x[0], x[1], p))
		return_data = r
	return Response(json.dumps(return_data), mimetype='application/json')

if __name__ == "__main__":
	# app.debug = True
	app.run(host="0.0.0.0")