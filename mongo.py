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
	suggestion = [word[0] for word in list(translation.find({"word": query}))[0][u'translation']]
	return suggestion

def family(query):
	db = mc['glance_word']
	families = db.families
	suggestion = [word[u'family'] for word in list(families.find({"word": query}))]
	return suggestion

if __name__ == '__main__':
	print position("study")
	print translation("study")
	print family("study")