# skunk_the_gibson
skunk the gibson repo


# Getting Started:
 * clone the repo and cd into it
 * Set up mongodb
    * Create data directory `mkdir data`
    * Create log directory `mkdir log` file
    * Create log/mongod.log
    * Start mongod the included conf file `mongod -f m.conf`
 * run `pip install -r requirements.txt` from root of the repo
 * run `export FLASK_APP=app.py` from root of the repo
 * run `flask run` from root of the repo
 * go to http://127.0.0.1:5000/app/ to view the app


# Project Structure:
 * `rootDir/templates` stores all html templates
 * `rootDir/static` contains all of our front end js (for instance DOM Manipulation) and css
 * `rootDir/venv` is the python folder that holds dependencies (Don't manually write to this folder)
 * `rootDir/app.py` is the root python file of our project
 * `rootDir/requirements.txt` is the dependency doc for our project
