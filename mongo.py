import pymongo
mc = pymongo.Connection('moon.nlpweb.org')
mc.admin.authenticate('nlplab', 'nlplab634')

def search_position(query):
	# print mc.database_names()
	db = mc['glance_word']
	# print mc.glance_word.collection_names()
	position = db.word
	return position.find_one({ "word": query})

if __name__ == '__main__':
	search_position("study")