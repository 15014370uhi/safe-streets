
import numpy as np
import joblib

# return crime category for a given crime value
def getCrimeCategory(aCrimeValue):     
    if(aCrimeValue == 0):    
        return 'Anti_social_behaviour' 
    if(aCrimeValue == 1):      
        return 'Theft' 
    if(aCrimeValue == 2):   
        return 'Burglary' 
    if(aCrimeValue == 3):   
        return 'Criminal_damage_and_arson' 
    if(aCrimeValue == 4):   
        return 'Drugs' 
    if(aCrimeValue == 5):   
        return 'Public_order' 
    if(aCrimeValue == 6):   
        return 'Possession_of_weapons' 
    if(aCrimeValue == 7): 
        return 'Violent_crime' 
    if(aCrimeValue == 8):   
        return 'Vehicle_crime' 

# Function which returns a crime probablity prediction score
# for a given location and month
def getResult(data):   
    
    results = {} 
    counter = 0

    for percentage in data:  
        aPercentage = f'{(percentage * 100):.2f}'
        aPercentage = str(aPercentage + '%')
        crimeCategory = getCrimeCategory(counter)
        results[crimeCategory] = aPercentage
        counter += 1   
    
    return results

def getProbability(month, year, lat, lon, sector):    
    
    # load models
    aLat = lat 
    aLon = lon
    
    # load KMeans cluster model for current sector
    clusterFile = 'KMini_' + sector + '.sav'    
    
    # load the model from the file
    cluster_model = joblib.load(clusterFile)
    
    # load the model as a file
    logisticRegressionFile = 'LogisticRegression_' + sector + '.sav'
 
    # Load the model from the file
    logisticRegressionModel = joblib.load(logisticRegressionFile)
    
    # get cluster value for current search location lat and lon using cluster model
    cluster = cluster_model.predict([[aLat, aLon]])
   
    # create X features array month, year, cluster value
    X = np.array([[year, month, cluster.item(0)]], dtype=np.float32)   
    
    # scale data
    X = logisticRegressionModel.scaler.transform(X) #scale feature data
   
    # year - month - cluster
    cluster_col = X[:, [2]]
   
    # get one-hot version of location
    oneHotEncodedCluster = logisticRegressionModel.encoder.transform(cluster_col).toarray()
        
    # combine data back into array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))   
    
    # get probability percentages for occurences of crime categories
    prediction = logisticRegressionModel.predict_proba(X)[0]    
    
    # generate result object
    result = getResult(prediction)
   
    return result