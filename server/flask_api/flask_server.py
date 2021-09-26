from flask import Flask, request
from flask_cors import CORS
import json 
from myRandomForest import getProbability

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
  return "Flask server running"

@app.route('/testrf', methods = ['POST'])
def postdata():    
    data = request.get_json(silent=True)  
    month = data.get('month')
    year = data.get('year')     
    lat = data.get('lat')
    lon = data.get('lon')    
    result = getProbability(month, year, lat, lon)
    print(result)      
    return json.dumps({
      'month': month,
      'year': year,
      'lat': lat, 
      'lon': lon    
      })
  
  
@app.route('/testflask', methods = ['POST'])
def postdata():    
    data = request.get_json(silent=True)  
    lat = data.get('lat')
    lon = data.get('lon')       
    return json.dumps({'lat': lat, 'lon': lon})
  
  
if __name__ == "__main__":
    app.run(port=5000)  
    
    # Get the output from the classification model
    #https://github.com/srishilesh/Machine-learning/blob/master/Local%20Deployment/server.py
    #variety = model.classify(sepal_len, sepal_wid, petal_len, petal_wid)
