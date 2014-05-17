#!/usr/bin/python
#-*- coding: utf-8 -*-

from flup.server.fcgi import WSGIServer

import sys
sys.path.append('/home/maxis/projects/glance')

from glance import app

if __name__ == '__main__':
	#WSGIServer(app,bindAddress='/tmp/maxiskao.sock').run()
	
	WSGIServer(app, multithreaded=True, \
		bindAddress=(sys.argv[1], int(sys.argv[2]))).run()
	
	#WSGIServer(app,bindAddress=('127.0.0.1',8888)).run()
