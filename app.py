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
    filter_list = [x for x in db.filters.find({ collection_name: {"$exists": True}}, { "pizza.name": 1, "_id": 0})]

    if filter_param is not None:
        # matches = { "data": [
        #     {
        #         "name": "Greek",
        #         "toppings": ["olives", "feta", "tomatoes", "cucmber", "onion"], 
        #         "style": "Greek",
        #         "rating": 7.5,
        #         "vegetarian": True
        #     }
        # ]}
        # return matches
        
        filter_list =  db.filters.aggregate([{"$match": {"pizza": {"$exists": True}}}, {"$unwind": "$pizza"}, {"$match": {"pizza.name": "Vegetarian"}}, {"$project": {"_id": 0}}])

        print("=========")
        query_str = filter_list.next()[collection_name]['query']
        print (query_str)
        #bar = db.pizza.find(json.dumps(foo))
        #print(bar)
        print("=========")
        # query_filter = matching_filter['query']
        matches = [x for x in db[collection_name].find(query_str)]
        print(matches)
        # matches = [x for x in db[collection_name].find(query_filter)]
        return { "data": dumps(matches)}
    else:
        matches = [x for x in db[collection_name].find()]

        json_result = dumps(matches)

        # print("----")
        # print(list(filter_list)[0][collection_name]['query'][0])
        # foo = db.pizza.find()
        return { "data": json_result, "filters": filter_list }
