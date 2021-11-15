from flask import Flask, request
from flask_cors import CORS
import json
import os
from myLogisticRegression import getPredictions 

#app = Flask(__name__, static_folder='../../build', static_url_path='')
#app = Flask(__name__, static_folder='../../build', static_url_path='')
app = Flask(__name__)
CORS(app)

#@app.route("/", defaults={'path':''})
@app.route("/")

# def index():
#     return app.send_static_file('index.html')
def index():
    return "Welcome to safe streets machine learning flask server"

@app.route("/predict", methods=["POST"])
def runPredictionModel():
    data = request.get_json(silent=True)
    month = data.get("month")
    year = data.get("year")
    lat = data.get("lat")
    lon = data.get("lon")
    sector = data.get("sector")

    # call machine learning function with data
    result = getPredictions(month, year, lat, lon, sector)   
    results_JSON = json.dumps(result)
   
<<<<<<< HEAD
    print("results_JSON: ", results_JSON)
=======
    #print("results_JSON: ", results_JSON)
>>>>>>> 4168a211b874b3b819b0f7b3bba07a8d3adba988
    
    return results_JSON

if __name__ == "__main__":
   app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
   
   # app.run(port=5000)
