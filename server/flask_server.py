#within myenv conda, inside server folder..   flask run

#import time
from flask import Flask, request
from flask_cors import CORS
import json 

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
  return "Flask server"
  

@app.route('/locations/')
def get_test(): 
  print(request.json)    
  return 'hello'


@app.route('/postdata/', methods = ['POST'])
def postdata():
    data = request.get_json()
    print(data)
    # do something with this data variable that contains the data from the node server
    return json.dumps({"newdata":"hereisthenewdatayouwanttosend"})


@app.errorhandler(404) 
def invalid_route(e): 
    return "Invalid route was found."

 #location: testlocation,
 #       testlat: testlat,
  #      testlon: testlon

    # Get the output from the classification model
    #https://github.com/srishilesh/Machine-learning/blob/master/Local%20Deployment/server.py
    #variety = model.classify(sepal_len, sepal_wid, petal_len, petal_wid)


# Run the Flask server
#if(__name__=='__main__'):
#    app.run(debug=True)      


if __name__ == "__main__":
    app.run(port=5000)  