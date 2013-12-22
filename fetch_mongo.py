import pymongo
mc = pymongo.Connection('moon.nlpweb.org')
mc.admin.authenticate('nlplab', 'nlplab634')

def position(query):
	# print mc.database_names()
	db = mc['glance_word']
	# print mc.glance_word.collection_names()
	position = db.word
	res = position.find_one({ "word": query.lower()})
	return None if res == None else res[u'position']

def translation(query):
	# print mc.database_names()
	db = mc['glance_word']
	# print mc.glance_word.collection_names()
	position = db.word
	res = position.find_one({ "word": query.lower()})
	return None if res == None else res[u'translation']

# def family(query):
# 	# print mc.database_names()
# 	db = mc['glance_word']
# 	# print mc.glance_word.collection_names()
# 	position = db.families
# 	return position.find_one({ "word": query})[u'PoS']

if __name__ == '__main__':
	print position("study")
	print translation("study")
	print family("study")