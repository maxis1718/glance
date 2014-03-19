import pymongo
mc = pymongo.Connection('lost.nlpweb.org')
db_glance_word = mc['glance_word']

def position(query):
	suggestion = db_glance_word['position'].find_one({"word": query}, {'_id':0})['position']
	return suggestion

def translation(query, num=5):
	mdoc = db_glance_word['translation'].find_one( {"word": query}, {'_id':0, 'translation':1} )
	suggestion = [{'translation':word[0], 'probability':round(float(word[2]),2)} for word in mdoc['translation']]
	return suggestion[:num]

def family(query):
	families = db_glance_word.families
	suggestion = [ word['family'] for word in families.find({"word": query}, {'_id':0}) ]
	return suggestion

def category(query):
	wdb = db_glance_word['word']
	res_dic = wdb.find_one( {"word": query}, {'_id':0} )

	# {
	# 	"%spoken": ,
	# 	"%written": ,
	# 	"classCodeCount": {},
	# 	"position": [],
	# 	"translation": ,
	# 	"word": ,
	# }

	category_dic = res_dic['classCodeCount']
	category_lst = []
	genre_lst = []

	for w in category_dic:
		if w.startswith('#'):
			if w == "#S" :
				genre_lst.append( ["Spoken", category_dic[ w ]/7222876.0] )
			elif w == "#W" :
				genre_lst.append( ["Written", category_dic[ w ]/99571196.0] )
			else:
				category_lst.append( [w[1:], category_dic[ w ]] )

	sorted_genre = sorted( genre_lst , key=lambda w: w[1] , reverse=True)
	sorted_category = sorted( category_lst , key=lambda w: w[1] , reverse=True)
	return [ sorted_genre , sorted_category ]
	


if __name__ == '__main__':
	print position("study")
	print translation("study")
	print family("study")