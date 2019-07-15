from flask import Flask, request, send_from_directory, render_template
from flask_pymongo import PyMongo

app = Flask(__name__,  static_url_path='/views')
app.config["MONGO_URI"] = "mongodb://localhost:27017/skunkWorks_db"
mongo = PyMongo(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/app/')
def hello():
    # activities = mongo.db.activities.find({})
    # return render_template('index.html', activities=activities)
   
    #sample data -- position should be computed based on # of results
    boxes = [{
                'position': "-2 1 -4",
                'rotation': "0 0 0",
                'scale': "1.25 1.25 1.25",
                'color': "#ffccee"
            },
            {
                'position': "0 1 -4",
                'rotation': "0 0 0",
                'scale': "1.25 1.25 1.25",
                'color': "#4cc3d9"
            },
            {
                'position': "2 1 -4",
                'rotation': "0 0 0",
                'scale': "1.25 1.25 1.25",
                'color': "#33ee22"
            }]

    return render_template('index.html', boxes=boxes)


@app.route('/collections/', methods=['POST'])
def collection_data():
    data = request.data
    dataDict = json.loads(data)
    db = dataDict['db']
    username = dataDict['user']
    password = dataDict['password']

    return 'TODO: fetch collections and get document counts for each'

@app.route('/documents/', methods=['POST'])
def document_data():
    data = request.data
    dataDict = json.loads(data)
    db = dataDict['db']
    username = dataDict['user']
    password = dataDict['password']
    collection = dataDict['collection']
    collectionFilter = dataDict['collectionFilter']

    return 'TODO'
