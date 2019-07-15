from flask import Flask
from flask import render_template
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
    return render_template('index.html')