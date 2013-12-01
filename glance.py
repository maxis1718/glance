#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, g, render_template, Response, json
# from urllib import unquote

# from pprint import pprint
# from collections import namedtuple, Counter

# from pymongo import Connection as mongoConn
# linggle_cache = mongoConn('localhost').linggle.cache

# import logging
# reload (logging)
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello glance!'


# if __name__ == '__main__':

#     import argparse
#     parser = argparse.ArgumentParser(description='Development Server Help')
#     parser.add_argument(
#         "-d", "--debug", action="store_true", dest="debug_mode",
#         help="run in debug mode", default=False)
#     parser.add_argument("-p", "--port", dest="port",
#                         help="port of server (default:%(default)s)", type=int, default=5000)

#     cmd_args = parser.parse_args()
#     app_options = {"port": cmd_args.port, 'host':'0.0.0.0'}

#     if cmd_args.debug_mode == False:
#         app_options["debug"] = True
#         app_options["use_debugger"] = False
#         app_options["use_reloader"] = False
#         app_options["host"] = "0.0.0.0"

#     app.run(**app_options)
 
