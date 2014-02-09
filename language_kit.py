from nltk.corpus import wordnet as wn


def query_word( word ):

	output_dic = {}

	synset_lst = wn.synsets( word )

	sense_lst = []


	if( len( synset_lst ) is not 0 ):
		for syn in synset_lst:

			syn_dic = {}

			syn_dic[ 'example' ] = syn.examples
			syn_dic[ 'definition' ] = syn.definition
			syn_dic[ 'lemma' ] = syn.lemma_names

			syn_dic[ 'sense' ] = syn.name

			# output_dic[ syn.name ]  = syn_dic

			sense_lst.append( syn_dic )

	output_dic[ 'query' ] = word
	output_dic[ 'contents' ] = sense_lst


	return output_dic

def query_hyponym( sense ):

	syn = wn.synset( sense )

	if( not syn):
		return {}

	syn_dic = {}

	syn_dic[ 'hyponyms' ] = [ { 'name': s.name } for s in syn.hyponyms() ]

	syn_dic[ 'name' ] = syn.name



	return syn_dic

def query_hypernym( sense ):

	syn = wn.synset( sense )

	if( not syn):
		return {}

	syn_dic = {}

	syn_dic[ 'hypernyms' ] = [ { 'name': s.name } for s in syn.hypernyms() ]

	syn_dic[ 'name' ] = syn.name



	return syn_dic


def synset_to_words( syn_name ):
	return syn_name.split(".")[0]





print query_word("dog")

