# -*- coding: utf-8 -*-

# substitute WordNet with SentiWordNet
#from nltk.corpus import wordnet as wn
import sentiwordnet as sw

# path to the SentiWordNet raw text dump
_SentiWordNet_path = 'data/SentiWordNet_3.0.0_20130122.txt'

# load SentiWordNet
swn = sw.SentiWordNetCorpusReader(_SentiWordNet_path)

def query_word( word ):

	output_dic = {}

	senti_synset_lst = swn.senti_synsets(word)

	if not senti_synset_lst: return output_dic

	for senti_syn in senti_synset_lst:

		# extract WordNet Synset
		syn = senti_syn.synset

		syn_dic = {}

		syn_dic[ 'example' ] = syn.examples
		syn_dic[ 'definition' ] = syn.definition
		syn_dic[ 'lemma' ] = syn.lemma_names
		syn_dic[ 'hypernyms' ] = [ s.name for s in syn.hypernyms() ]
		syn_dic[ 'hyponyms' ] = [ s.name for s in syn.hyponyms() ]

		syn_dic[ 'polarity' ] = { 'positive': senti_syn.pos_score, 'negative': senti_syn.neg_score, 'objective': senti_syn.obj_score}

		output_dic[ syn.name ]  = syn_dic

	return output_dic

def synset_to_words( syn_name ):
	return syn_name.split(".")[0]

if __name__ == '__main__':
	from pprint import pprint
	
	while True:
		print 'input >',
		query = raw_input()

		pprint(query_word( query ))

		print '='*50



