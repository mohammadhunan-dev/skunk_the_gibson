# skunk_the_gibson
Skunkworks July 2019 project


julia.oppenheim@mongodb.com

mohammed.hunan@mongodb.com

chris.cho@mongodb.com

# Description:

VR browser for MongoDB databases. Explore data by navigating through collections and documents. Apply user-configurable filters on collections to reveal more specific views.

# Getting Started:
 * clone this repo
 * Set up mongodb
    * Install mongodb if necessary: https://docs.mongodb.com/manual/installation/
    * Create directories for mongod: `mkdir data && mkdir log`
    * Create log file for mongod: `touch log/mongod.log`
    * Start mongod the included conf file `mongod -f m.conf`
 * run `pip install -r requirements.txt` from root of the repo
 * run `export FLASK_APP=app.py` from root of the repo
 * run `flask run` from root of the repo
 * import the data; for each file: `mongoimport --drop -d <db name> data -c <collection name> --jsonArray --file json_data/<file>`
 * go to http://localhost:5000/ to view the app


# Project Structure:
 * `rootDir/templates` stores html templates
 * `rootDir/static` contains all of our front end js (for instance DOM Manipulation) and css
 * `rootDir/app.py` is the main python application for this project
 * `rootDir/requirements.txt` is the python dependency file for our project
