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
    
    print('Flask received sector: ' + sector);
    result = getProbability(month, year, lat, lon, sector) #invoke best model
    
    #print(result.get('Drugs') )      
   
    results_JSON = json.dumps(result)  
    
    #print(results_JSON)
    #return json.dumps({'result': result})
    
    return results_JSON

    
#@app.route('/testflask', methods = ['POST'])
#def postdata():    
#    data = request.get_json(silent=True)  
#    lat = data.get('lat')
#    lon = data.get('lon')       
#    return json.dumps({'lat': lat, 'lon': lon})
  
  
if __name__ == '__main__':
    app.run(port=5000)  
    
    # Get the output from the classification model
    #https://github.com/srishilesh/Machine-learning/blob/master/Local%20Deployment/server.py
    #variety = model.classify(sepal_len, sepal_wid, petal_len, petal_wid)
