# -*- coding: utf-8 -*-
import sys
from collections import Counter
from collections import defaultdict
# substitute WordNet with SentiWordNet
#from nltk.corpus import wordnet as wn
import sentiwordnet as sw
import mongo as DB  # fetch data from MongoDB running on moon
import bnc_classcode
import pprint
## path to the SentiWordNet raw text dump
_SentiWordNet_path = 'data/SentiWordNet_3.0.0_20130122.txt'

## load SentiWordNet
print >> sys.stderr, 'loading SentiWordNet ...',
sys.stderr.flush()
swn = sw.SentiWordNetCorpusReader(_SentiWordNet_path)
print >> sys.stderr, 'done'


# def process_bnc_classCode():

# 	dic = {}
# 	for k, v in bnc_classcode.items():
# 		dic[ " ".join(v) ] = v

# 	print dic



	




def query_word( word ):

	output_dic = {}


	senti_synset_lst = swn.senti_synsets(word)

	if not senti_synset_lst: return output_dic

	sense_lst = []
	pos_index_dic = Counter()

	for senti_syn in senti_synset_lst:

		# extract WordNet Synset
		syn = senti_syn.synset

		syn_dic = {}
		syn_dic[ 'example' ] = syn.examples
		syn_dic[ 'definition' ] = syn.definition
		syn_dic[ 'lemma' ] = syn.lemma_names

		syn_dic[ 'sense' ] = syn.name
		syn_dic[ 'POS' ] = syn.pos
		syn_dic[ 'polarity' ] = { 'positive': senti_syn.pos_score, 'negative': senti_syn.neg_score, 'objective': senti_syn.obj_score}

		sense_lst.append( syn_dic )
		pos_index_dic[ syn.pos ] += 1
 
	output_dic[ 'query' ] = word
	output_dic[ 'contents' ] = sense_lst
	output_dic[ 'pos_index' ] = pos_index_dic
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


def xmlize( dic ):

	cur_dic = {}

	for key,value in dic.iteritems():
		
		if( isinstance( value , list ) ):
			cur_dic[ 'name' ] = key
			cur_dic[ 'children' ] = [ xmlize( x ) for x in value ]
		else:
			cur_dic[ 'name' ] = key
			cur_dic[ 'size' ] = value

	return cur_dic
	

def merge_tree(tree1, tree2):
    result = []
    for subtree1 in tree1:
        name1 = subtree1.keys()[0]
        is_match = False
 
        for idx, subtree2 in enumerate( tree2):
            name2 = subtree2.keys()[0]
            if name1 == name2:
                # print name1
                if not isinstance( subtree1.values()[0] , int ) and not isinstance( subtree1.values()[0] , int ):
	                result.append({name1: merge_tree(subtree1.values()[0], subtree2.values()[0])} )
	                del tree2[idx]
	                is_match  = True
	                break
 
        if is_match == False:
            result.append(subtree1)
    result.extend(tree2)
    return result




def build_child( lst  ):
	if len(lst) == 2:

		return { lst[0] : lst[1] }

	# name = lst[0]
	# if( adic.has_key( name ) ):
	# 	adic[ name ].append( build_child( lst[1:] , adic ) )
	# else:
	# 	adic[ name ] = [ build_child( lst[1:] , adic ) ]
	return {  lst[0] : [ build_child( lst[1:] ) ] }

def query_category( qWord ):

	res = DB.category(qWord)
	return_data = [] if res == None else res

	category_lst = return_data[1]

	level_lst = []
	level_dic = {}
	for cat, freq in category_lst:
		cat = cat.replace(":","")
		cat_lst = []



		# print cat, freq
		if not bnc_classcode.smp_bnc_classcode.has_key( cat ):
			cat_lst = cat.split(" ",1)
			cat_lst.append( freq )
			
			
		else:
			cat_lst += bnc_classcode.smp_bnc_classcode[cat]
			cat_lst.append( freq )
			
			level_lst.append( [ build_child( cat_lst ) ])

	target_dic = { "root": reduce( merge_tree , level_lst ) }

	return xmlize( target_dic  )
	
			

def build_level( lst ):
	iter_time = max( [ len(x) for x in lst ] )
	i = 0

	res_dic = defaultdict(list)

	iter_time -= 1







	while iter_time:
		



		name = lst[i]
		children = lst[i+1:]

		res_dic = { 'name' : name , 'children': children }



		iter_time -= 1








def synset_to_words( syn_name ):
	return syn_name.split(".")[0]

# if __name__ == '__main__':

# 	from pprint import pprint

# 	while True:
# 		print 'input >',
# 		query = raw_input()

# 		pprint(query_word( query ))

# 		print '='*50
