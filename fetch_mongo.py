import pymongo
mc = pymongo.Connection('lost.nlpweb.org')

def position(query):
	db = mc['glance_word']
<<<<<<< HEAD:mongo.py
	position = db.position
	suggestion = list(position.find({"word": query}))[0][u'position']
	return suggestion
=======
	# print mc.glance_word.collection_names()
	position = db.word
	res = position.find_one({ "word": query.lower()})
	return None if res == None else res[u'position']
>>>>>>> 9db6f095fd3aff6b38bf00b7735bcdfa6cf1fceb:fetch_mongo.py

def translation(query):
	db = mc['glance_word']
<<<<<<< HEAD:mongo.py
	translation = db.translation
	suggestion = [word[0] for word in list(translation.find({"word": query}))[0][u'translation']]
	return suggestion
=======
	# print mc.glance_word.collection_names()
	position = db.word
	res = position.find_one({ "word": query.lower()})
	return None if res == None else res[u'translation']
>>>>>>> 9db6f095fd3aff6b38bf00b7735bcdfa6cf1fceb:fetch_mongo.py

def family(query):
	db = mc['glance_word']
	families = db.families
	suggestion = [word[u'family'] for word in list(families.find({"word": query}))]
	return suggestion

if __name__ == '__main__':
	print position("study")
	print translation("study")
	print family("study")