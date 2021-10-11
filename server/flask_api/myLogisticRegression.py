import numpy as np
import joblib  

# returns the crime category for a given crime value
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


# function which formats crime prediction results into an object
def getResult(data):   
    
    results = {}
    counter = 0

    for percentage in data:  
        aPercentage = f'{(percentage * 100):.2f}'
        #aPercentage = str(aPercentage + '%')
        crimeCategory = getCrimeCategory(counter)
        results[crimeCategory] = aPercentage
        counter += 1   
    
    return results    
    
# function which returns the probablity of crime types occuring for a specific time and location
def getProbability(month, year, lat, lon, sector):       
    
    # load KMeans cluster model for current sector
    clusterFile = 'KMini_' + sector + '.sav'    
    
    # Load logistic regression model from file
    cluster_model = joblib.load(clusterFile)
    
    # load the model as a file
    logisticRegressionFile = 'LogisticRegression_' + sector + '.sav'
 
    # Load the model from the file
    logisticRegressionModel = joblib.load(logisticRegressionFile)
    
    # get cluster value for current search location lat and lon using cluster model
    cluster = cluster_model.predict([[lat, lon]])
   
    # create X features array as month, year, cluster value
    X = np.array([[year, month, cluster.item(0)]], dtype=np.float32)   
    
    # scale data
    X = logisticRegressionModel.scaler.transform(X) 
   
    # cluster
    cluster_col = X[:, [2]]
   
    # get one-hot version of cluster col
    oneHotEncodedCluster = logisticRegressionModel.encoder.transform(cluster_col).toarray()
        
    # combine one hot encoded cluster values back into array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))
    
    # get probability for crime categories
    prediction = logisticRegressionModel.predict_proba(X)[0] 
        
    # generate result object
    result = getResult(prediction)
   
    return result