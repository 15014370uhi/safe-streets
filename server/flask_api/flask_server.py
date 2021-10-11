from flask import Flask, request
from flask_cors import CORS
import json 
from myLogisticRegression import getProbability

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
  return 'Welcome to safe streets machine learning flask server'

@app.route('/predict', methods = ['POST'])
def runPredictionModel():    
    data = request.get_json(silent=True)  
    month = data.get('month')
    year = data.get('year')     
    lat = data.get('lat')
    lon = data.get('lon')  
    sector = data.get('sector') 
    
    result = getProbability(month, year, lat, lon, sector) #invoke best model   
    results_JSON = json.dumps(result)      
    return results_JSON
      
if __name__ == '__main__':
    app.run(port=5000)     