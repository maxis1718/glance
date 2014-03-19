import pymongo
mc = pymongo.Connection('lost.nlpweb.org')

def position(query):
	db = mc['glance_word']
	position = db.position
	suggestion = list(position.find({"word": query}))[0][u'position']
	return suggestion

def translation(query):
	db = mc['glance_word']
	translation = db.translation
	suggestion = [{'translation':word[0], 'probability':round(float(word[2]),2)} for word in list(translation.find({"word": query}))[0][u'translation']]
	return suggestion[:5]

def family(query):
	db = mc['glance_word']
	families = db.families
	suggestion = [word[u'family'] for word in list(families.find({"word": query}))]
	return suggestion

def genre(query):
	db = mc['glance_word']
	wdb = db['word']
	results = [ word for word in wdb.find({"word": query})]
	
	res_dic = results[0];

	genre_lst = []
	for w in res_dic.keys():
		if( w[0] == "%"):
			genre_lst.append( [w,res_dic[ w ]] )

	sorted_genre = sorted( genre_lst , key=lambda w: w[1] , reverse=True)
	return sorted_genre

def category(query):
	db = mc['glance_word']
	wdb = db['word']
	results = [ word for word in wdb.find({"word": query})]
	
	res_dic = results[0];
	category_dic = res_dic['classCodeCount']
	category_lst = []
	genre_lst = []
	for w in category_dic.keys():
		if w[0] == "#":
			if w == "#S" :
				genre_lst.append( [w[1:],category_dic[ w ]/7222876.0] )
			elif w == "#W" :
				genre_lst.append( [w[1:],category_dic[ w ]/99571196.0] )
			else:
				category_lst.append( [w[1:],category_dic[ w ]] )

				

	sorted_genre = sorted( genre_lst , key=lambda w: w[1] , reverse=True)
	sorted_category = sorted( category_lst , key=lambda w: w[1] , reverse=True)
	return [ sorted_genre , sorted_category ]
	


if __name__ == '__main__':
	print position("study")
	print translation("study")
	print family("study")