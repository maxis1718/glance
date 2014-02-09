# -*- coding: utf-8 -*-

import sentiwordnet as sw
import sys
from collections import defaultdict

## pos: n(noun), a(adj), r(adv), v
def polarity(swn, word):
	# syn.synset.lemma_names
	# syn.synset.pos
	# syn.synset.examples
	# syn.synset.lexname

	# syn.neg_score
	# syn.pos_score
	# syn.obj_score	
	D = defaultdict(list)
	for syn in swn.senti_synsets(word):
		D[syn.synset.pos].append( (syn.synset, syn.pos_score, syn.neg_score) ) 
	return dict(D)

if __name__ == '__main__':

	_SentiWordNet_path = 'data/SentiWordNet_3.0.0_20130122.txt'

	# load SentiWordNet 
	swn = sw.SentiWordNetCorpusReader(_SentiWordNet_path)

	from pprint import pprint
	# show polarity of 'good'
	while True:
		print 'input >', 
		word = raw_input()
		pprint(polarity(swn, word))
		print '='*50

