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
 * import the mongo document data with the script `import.sh`
 * go to http://localhost:5000/ to view the app


# Project Structure:
 * `<project root>/templates` stores html templates
 * `<project root>/static` contains all of our front end js (for instance DOM Manipulation) and css
 * `<project root>/app.py` is the main python application for this project
 * `<project root>/requirements.txt` is the python dependency file for our project
