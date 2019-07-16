from flask import Flask, request, send_from_directory, render_template, json
from flask_pymongo import PyMongo

app = Flask(__name__,  static_url_path='/views', static_folder="static")
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
                'color': 'salmon',
                'collectionName': 'pizza'

            },
            {
                'color': 'steelblue',
                'collectionName': 'furniture'
            },
            {
                'color': 'springgreen',
                'collectionName': 'skunks'
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

@app.route('/documents/', methods=['GET'])
def document_data():
    #data = request.data
    #dataDict = json.loads(data)
    #db = dataDict['db']
    #username = dataDict['user']
    #password = dataDict['password']
    #collection = dataDict['collection']
    #collectionFilter = dataDict['collectionFilter']

    doc_data = [
        {
            "name": "Margherita", 
            "toppings": ["mozzarella", "basil", "tomato sauce"],  
            "style": "Neapolitan", 
            "rating": 8,
            "vegetarian": "true"  
        },
        {
            "name": "Greek", 
            "toppings": ["olives", "feta", "tomatoes", "cucmber", "onion"], 
            "style": "Greek",  
            "rating": 7.5,
            "vegetarian": "true" 
        },
        {
            "name": "Pepperoni", 
            "toppings": ["cheese", "tomato sauce", "pepperoni"],
            "style": "Sicilian", 
            "rating": 4, 
            "vegetarian": "false"
        },
        {
            "name": "Deep Dish", 
            "toppings": ["tomato sacue", "sausage"],  
            "style": "Chicago", 
            "vegetarian": "false" 
        },
        {
            "name": "Hawaiian", 
            "toppings": ["pineapple", "ham", "cheese", "tomato sauce"],
            "style": "NYC",  
            "rating": 9, 
            "vegetarian": "false"  
        },
        {
            "name": "White", 
            "toppings": ["ricotta", "parmesan", "mozzarella", "garlic", "sage"], 
            "style": "NYC",  
            "rating": 10, 
            "vegetarian": "true" 
        },
        {
            "name": "Broccoli Rabe", 
            "toppings": ["sausage", "broccoli rabe", "cheese"], 
            "crust": "St. Louis",   
            "rating": 1
        },
        {
            "name": "Artichoke", 
            "toppings": ["cheese", "garlic", "artichoke"], 
            "crust": "Neapolitan", 
            "rating": 9, 
            "vegetarian": "true"  
        },
        {
            "name": "Vegetable", 
            "toppings": ["artichoke", "mushroom", "olive", "zuchinni", "eggplant", "basil", "tomato sacue", "cheese"], 
            "crust": "NYC", 
            "rating": 8.5, 
            "vegetarian": "true" 
        }
    ]

    app.logger.info(doc_data)


    return render_template('documents.html', data=doc_data)
