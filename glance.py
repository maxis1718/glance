# -*- coding: UTF-8 -*-

from flask import Flask, render_template, request, redirect, Response, jsonify, url_for
import json, os, sys
import language_kit as LK
import mongo as DB  # fetch data from MongoDB running on moon
from flask_yeoman import flask_yeoman


app = Flask(__name__, static_folder='app/static', template_folder='app/template', static_url_path='')
app.register_blueprint(flask_yeoman)
# app.config.update(DEBUG=True)
app.debug = True

### ---------------------------- Functions ---------------------------- ###

print >> sys.stderr, 'loading json ...',
sys.stdout.flush()
## word pos filter
bnc_pos  = json.load(open('app/static/data/bnc.word.filter.json'))
## word test
bnc_test = json.load(open('app/static/data/bnc.word.test.json'))
print >> sys.stderr, 'done.'

# print os.environ.get('FLASK_YEOMAN_DEBUG', False)

## word position
# bnc_wp = json.load(open('static/data/XY/pure/h.pure.json'))





### ---------------------------- UI ---------------------------- ###
# ==== View ====
@app.route('/')
def hello():
    return render_template('index.html')


# ==== API =====


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

@app.route("/demo/char")
def show_wp():
	return render_template('char.html')

@app.route("/demo/plot")
def show_plot():
	return render_template('plot.html')

@app.route("/demo/cluster")
def show_cluster():
	return render_template('cluster.html')

### ---------------------------- API ---------------------------- ###
### pos API
@app.route('/api/word/<query>/usages/')
@app.route('/api/word/<query>/usages')
def word_usages(query):
	pass

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
@app.route('/api/sense/<query>/word/')
@app.route('/api/sense/<query>/word')
def sense_to_word( query ):
	return LK.synset_to_words( query )

# query word info
# input: word 
@app.route('/api/word/<query>/')
@app.route('/api/word/<query>')
def query_word_info( query ):

	return Response(json.dumps( LK.query_word( query ) ), mimetype='application/json')

# query hypernym and hyponym and definition of a word 
# input: sense

@app.route('/api/sense/<query>/hyponym/')
@app.route('/api/sense/<query>/hyponym')
def query_hyponym( query ):

	return Response(json.dumps( LK.query_hyponym( query ) ), mimetype='application/json')



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
def word_position(query, step=10):
	res = DB.position(query)
	return_data = [] if res == None else res
	compact_data = [ [ i, sum(return_data[1][i*step:(i+1)*step]) ] for i,x in enumerate(return_data[0][::step]) ]
	# return_data = [] if query not in bnc_wp else bnc_wp[query]
	# return_data = [] if query not in bnc_test else bnc_test[query]
	return Response(json.dumps(compact_data), mimetype='application/json')

@app.route('/api/cword/<query>/translation/')
@app.route('/api/cword/<query>/translation')
def translate_to_english(query):
	res = DB.translation(query)
	return_data = [] if res == None else res
	return Response(json.dumps(return_data), mimetype='application/json')

@app.route('/api/word/<query>/genre/')
@app.route('/api/word/<query>/genre')
def word_genre(query):
	res = DB.category(query)
	return_data = [] if res == None else res
	return Response(json.dumps(res[0]), mimetype='application/json')

@app.route('/api/word/<query>/category/')
@app.route('/api/word/<query>/category')
def word_category(query):
	res = LK.query_category( query )

	return Response(json.dumps(res), mimetype='application/json')


if __name__ == "__main__":
	app.config.update(
	    DEBUG=False,
	    SEND_FILE_MAX_AGE_DEFAULT=0
	)
	app.run(host="0.0.0.0")

