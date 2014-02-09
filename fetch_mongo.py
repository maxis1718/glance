import pymongo
mc = pymongo.Connection('lost.nlpweb.org')

def position(query):
	db = mc['glance_word']
	# print mc.glance_word.collection_names()
	position = db.word
	res = position.find_one({ "word": query.lower()})
	return None if res == None else res[u'position']

def translation(query):
	db = mc['glance_word']
	# print mc.glance_word.collection_names()
	position = db.word
	res = position.find_one({ "word": query.lower()})
	return None if res == None else res[u'translation']

def family(query):
	db = mc['glance_word']
	families = db.families
	suggestion = [word[u'family'] for word in list(families.find({"word": query}))]
	return suggestion

if __name__ == '__main__':
	print position("study")
	print translation("study")
	print family("study")
