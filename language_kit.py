# -*- coding: utf-8 -*-
import sys

# substitute WordNet with SentiWordNet
#from nltk.corpus import wordnet as wn
import sentiwordnet as sw

## path to the SentiWordNet raw text dump
_SentiWordNet_path = 'data/SentiWordNet_3.0.0_20130122.txt'

## load SentiWordNet
print >> sys.stderr, 'loading SentiWordNet ...',
sys.stderr.flush()
swn = sw.SentiWordNetCorpusReader(_SentiWordNet_path)
print >> sys.stderr, 'done'

def query_word( word ):

	output_dic = {}


	senti_synset_lst = swn.senti_synsets(word)

	if not senti_synset_lst: return output_dic

	sense_lst = []
	for senti_syn in senti_synset_lst:

		# extract WordNet Synset
		syn = senti_syn.synset

		syn_dic = {}
		syn_dic[ 'example' ] = syn.examples
		syn_dic[ 'definition' ] = syn.definition
		syn_dic[ 'lemma' ] = syn.lemma_names

		syn_dic[ 'sense' ] = syn.name

		syn_dic[ 'polarity' ] = { 'positive': senti_syn.pos_score, 'negative': senti_syn.neg_score, 'objective': senti_syn.obj_score}

		sense_lst.append( syn_dic )

	output_dic[ 'query' ] = word
	output_dic[ 'contents' ] = sense_lst

	return output_dic

def query_hyponym( sense ):

	syn = swn.senti_synset(sense).synset

	if( not syn):
		return {}

	syn_dic = {}
	# dig into the second tree
	syn_dic[ 'hyponyms' ] = [ { 'name': synset_to_words(s.name) , 'sense':s.name , '_hyponyms': [ { 'name': x.name } for x in s.hyponyms() ] } for s in syn.hyponyms() ]

	syn_dic[ 'name' ] = syn.name

	return syn_dic

def query_hypernym( sense ):

	syn = swn.senti_synset(sense).synset

	if( not syn):
		return {}

	syn_dic = {}

	syn_dic[ 'hypernyms' ] = [ { 'name': s.name } for s in syn.hypernyms() ]

	syn_dic[ 'name' ] = syn.name

	return syn_dic


def synset_to_words( syn_name ):
	return syn_name.split(".")[0]

if __name__ == '__main__':

	from pprint import pprint

	while True:
		print 'input >',
		query = raw_input()

		pprint(query_word( query ))

		print '='*50
