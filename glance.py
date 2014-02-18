# -*- coding: UTF-8 -*-

from flask import Flask, render_template, request, redirect, Response
import json, os, sys
import language_kit as LK
import mongo as DB  # fetch data from MongoDB running on moon

app = Flask(__name__)


### ---------------------------- Functions ---------------------------- ###

print >> sys.stderr, '(glance) loading json ...',
sys.stdout.flush()
## word pos filter
bnc_pos  = json.load(open('static/data/bnc.word.filter.json'))

## word test
bnc_test = json.load(open('static/data/bnc.word.test.json'))

## word position
# bnc_wp = json.load(open('static/data/XY/pure/h.pure.json'))
print >> sys.stderr, 'done.'

### ---------------------------- UI ---------------------------- ###

@app.route('/')
def hello():
    return render_template('index.html')

@app.route("/demo/pos")
@app.route("/demo/pos/")
@app.route('/demo/postag')
@app.route('/demo/postag/')
def show_pos():
	return render_template('pos.html')


@app.route("/demo/test")
@app.route("/demo/test/")
@app.route('/demo/difficulty')
@app.route('/demo/difficulty/')
def show_test():
	return render_template('test.html')

@app.route("/demo/wp")
@app.route("/demo/wp/")
def show_wp():
	return render_template('wp.html')

@app.route('/demo/translation')
@app.route('/demo/translation/')
def show_translation_cht():
	return render_template('translation.html')

### ---------------------------- API ---------------------------- ###
### pos API

# @app.route('/api/<query>/pos')
@app.route('/api/word/<query>/postag/')
@app.route('/api/word/<query>/postag')
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

@app.route('/api/word/<query>/translation/')
@app.route('/api/word/<query>/translation')
def translate_first_cht(query):
	res = DB.translation(query)
	return_data = [] if res == None else res
	return Response(json.dumps(return_data), mimetype='application/json')

### wordnet related 
# sense to word
# input: sense ( e.g 'dog.n.1' )
@app.route('/api/word/<query>/sense/')
@app.route('/api/word/<query>/sense')
def sense_to_word( query ):
	return LK.synset_to_words( query )

# query hypernym and hyponym and definition of a word 
# input: word 
@app.route('/api/word/<query>/info/')
@app.route('/api/word/<query>/info')
def query_word_info( query ):
	res = LK.query_word( query )
	if 'status' in res and not res['status']: return res
	return Response(json.dumps( res ), mimetype='application/json')

### test API
# @app.route('/api/test/<query>')
@app.route('/api/word/<query>/difficulty/')
@app.route('/api/word/<query>/difficulty')
def test_level(query):
	return_data = [] if query not in bnc_test else bnc_test[query]
	return Response(json.dumps(return_data), mimetype='application/json')

### test API
# @app.route('/api/wp/<query>')
@app.route('/api/word/<query>/wp/')
@app.route('/api/word/<query>/wp')
def word_position(query):
	res = DB.position(query)
	return_data = [] if res == None else res
	# return_data = [] if query not in bnc_wp else bnc_wp[query]
	# return_data = [] if query not in bnc_test else bnc_test[query]
	return Response(json.dumps(return_data), mimetype='application/json')


if __name__ == "__main__":
	# app.debug = True
	app.run(host="0.0.0.0")