#within myenv conda, inside server folder..   flask run

import time
from flask import Flask, request
#import jsonify # Import flask libraries

app = Flask(__name__)


@app.route('/locations')
#@app.route('/test', methods=['GET', 'POST'])
def get_test():
     return {'time': time.time()}

#@app.route('/time')
#def get_current_time():
#    return {'time': time.time()}


@app.route('/times')
def get_current_time():
    return {'time': time.time()}


 #location: testlocation,
 #       testlat: testlat,
  #      testlon: testlon

    # Get the output from the classification model
    #https://github.com/srishilesh/Machine-learning/blob/master/Local%20Deployment/server.py
    #variety = model.classify(sepal_len, sepal_wid, petal_len, petal_wid)


# Run the Flask server
if(__name__=='__main__'):
    app.run(debug=True)        