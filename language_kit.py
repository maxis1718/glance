from nltk.corpus import wordnet as wn


def query_word( word ):

	output_dic = {}

	synset_lst = wn.synsets( word )

	if( len( synset_lst ) is not 0 ):
		for syn in synset_lst:

			syn_dic = {}

			syn_dic[ 'example' ] = syn.examples
			syn_dic[ 'definition' ] = syn.definition
			syn_dic[ 'lemma' ] = syn.lemma_names
			syn_dic[ 'hypernyms' ] = [ s.name for s in syn.hypernyms() ]
			syn_dic[ 'hyponyms' ] = [ s.name for s in syn.hyponyms() ]

			output_dic[ syn.name ]  = syn_dic



	return output_dic

def synset_to_words( syn_name ):
	return syn_name.split(".")[0]



print query_word( "dog" )



