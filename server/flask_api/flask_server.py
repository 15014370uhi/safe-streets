#within myenv conda, inside server folder..   flask run

from flask import Flask, request
from flask_cors import CORS
import json 

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
  return "Flask server"


@app.route('/bob', methods=['GET', 'POST'])
def returnmessage():
      if request.method == 'POST':           
          #print(request.data)
          print(request.data)
          # print(request)
          #myresponse = {'message': 'hello from flask'}
          return request.data
      return 'wasnt POST'
  
  
@app.route('/locations2', methods = ['POST'])
def postdata():
    #data = request.get_json()
    print(request.data)
    testdata = request.data #print(data.name)
    # do something with this data variable that contains the data from the node server
    return json.dumps({"newdata": testdata})





if __name__ == "__main__":
    app.run(port=5000)  
    
    
    # Get the output from the classification model
    #https://github.com/srishilesh/Machine-learning/blob/master/Local%20Deployment/server.py
    #variety = model.classify(sepal_len, sepal_wid, petal_len, petal_wid)
