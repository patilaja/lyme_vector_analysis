#Import dependecies
from flask import Flask, jsonify,render_template
import psycopg2

#Constants for DB Connections
db_host= "ec2-52-0-155-79.compute-1.amazonaws.com"
db_name = "dchplfe6pe6n1h"
db_user ="hehyvkiqvzdmhq"
db_password = "e0d26d100db3ce0a397229444efb4bbc7ebd9c2d2b56e15477f677f2fe1ece41"

#Get app
app = Flask(__name__)

#DB Connect function
def dbConnection(db_host,db_name,db_user,db_password):

    try:
        conn= psycopg2.connect(host=db_host,database=db_name, user=db_user, password=db_password)
        return conn
    except:
        print("DB Connection could not be established. Please check DB settings including URL, ID and Password.")
        print("Please do not excute subsequent code as it is dependent on database connectivity.")
    else:
        print("DB Connection was successfully established")


#Function purpose: Get deer population and lyme case count
#Return the JSON representation of your dictionary.
def fDeerpopLymeCount():
    try:
        #Establish DB connection - All parameters are available as environment variables
        conn = dbConnection(db_host,db_name,db_user,db_password)
        cur = conn.cursor()
        cur.execute('SELECT * FROM  "public"."deerpopcounty"')
        data = [col for col in cur]
        cur.close()
        conn.close()
        return data
    except:
        print("Failed to get database result for deerpopcounty table.")

def fHarvestLymeCount():
    try:
        #Establish DB connection - All parameters are available as environment variables
        conn = dbConnection(db_host,db_name,db_user,db_password)
        cur = conn.cursor()
        cur.execute('SELECT * FROM  "public"."lymeHarvest"')
        data = [col for col in cur]
        cur.close()
        conn.close()
        return data
    except:
        print("Failed to get database result for lymeHarvest table.")
