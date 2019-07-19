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
        if name == "filters":
            continue

        app.logger.info("name: %s" % name)
        filter_list = [x for x in db.filters.find({name: {"$exists": True}}).limit(50)]
        col_data.append({
            'name': name,
            'count': db[name].count(),
            'filters': filter_list
            })

    return render_template('index.html', data=col_data, last_updated = time.time())

@app.route('/collections/<collection_name>', methods=['GET'])
def collection_data(collection_name):
    matches = []
    json_result = {}

    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["data"] 

    filter_param = request.args.get('filter')
    filter_list = dumps([x for x in db.filters.find({ collection_name: {"$exists": True}}) ])

    if filter_param is not None:
        col_key = '${}'.format(collection_name)
        col_sub = '{}.name'.format(collection_name)
        
        agg_result =  db.filters.aggregate([{"$match": {collection_name: {"$exists": True}}}, {"$unwind": col_key}, {"$match": {col_sub: filter_param}}, {"$project": {"_id": 0}}])

        query_str = agg_result.next()[collection_name]['query']
        matches = [x for x in db[collection_name].find(query_str).limit(50)]
        json_result = dumps(matches)

    else:
        matches = [x for x in db[collection_name].find().limit(50)]
        json_result = dumps(matches)


    return { "data": json_result, "filters": filter_list }
