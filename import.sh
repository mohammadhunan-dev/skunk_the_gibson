#!/bin/bash

mongoimport --drop -d data -c sports --jsonArray --file json_data/Sports.json 
mongoimport --drop -d data -c furniture --jsonArray --file json_data/Furniture.json 
mongoimport --drop -d data -c pizza --jsonArray --file json_data/Sports.json 
mongoimport --drop -d data -c filters --jsonArray --file json_data/Filters.json 