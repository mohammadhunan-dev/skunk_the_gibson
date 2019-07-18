from flask import Flask, request, send_from_directory, render_template, json
from flask_pymongo import pymongo
from bson.json_util import dumps, loads
from urllib import unquote
import pprint
import time

app = Flask(__name__,  static_url_path='/views', static_folder="static")
#app.config["MONGO_URI"] = "mongodb://localhost:27017/skunkWorks_db"
#mongo = PyMongo(app)

@app.route('/')
def collections():
    col_data = []

    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["data"]

    for name in db.list_collection_names():
        filter_list = [x for x in db.filters.find({name: {"$exists": True}})]
        col_data.append({
            'name': name,
            'count': db[name].count(),
            'filters': filter_list
            })

    return render_template('index.html', data=col_data, last_updated = time.time())

@app.route('/collections/<collection_name>', methods=['GET'])
def collection_data(collection_name):
    matches = []

    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["data"] 

    filter_param = request.args.get('filter')

    if filter_param is not None:
        matches = { "data": [
            {
               "name": "Greek",
                "toppings": ["olives", "feta", "tomatoes", "cucmber", "onion"], 
                "style": "Greek",
                "rating": 7.5,
                "vegetarian": True
            }
        ]}
        return matches
        # matching_filter = db.filters.findOne({ "name": unquote(filter_param)})
        # query_filter = matching_filter['query']
        # matches = [x for x in db[collection_name].find(query_filter)]
    else:
        matches = [x for x in db[collection_name].find()]

    json_result = dumps(matches)
    pp = pprint.PrettyPrinter(indent=4)

    pp.pprint(json_result)

    return { "data": json_result }
