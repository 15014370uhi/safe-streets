import numpy as np
import joblib  

# function which returns the crime category for a given crime value
def getCrimeCategory(aCrimeValue):
    if(aCrimeValue == 0):
        return 'Anti_social_behaviour'  # anti-social behaviour
    if(aCrimeValue == 1):
        return 'Theft'  # theft
    if(aCrimeValue == 2):
        return 'Burglary'  # burglary
    if(aCrimeValue == 3):
        return 'Criminal_damage_and_arson'  # criminal damage
    if(aCrimeValue == 4):
        return 'Drugs'  # drugs
    if(aCrimeValue == 5):
        return 'Public_order'  # public order
    if(aCrimeValue == 6):
        return 'Possession_of_weapons'  # weapons
    if(aCrimeValue == 7):
        return 'Violent_crime'  # violent crime
    if(aCrimeValue == 8):
        return 'Vehicle_crime'  # vehicle
    if(aCrimeValue == 9):
        return 'Shoplifting' # shop lifting 

# function which formats crime prediction results into an object
def getResult(data):   
    
    results = {}
    counter = 0

    # iterate over crime predictions and format to 2 decimal places
    for percentage in data:  
        aPercentage = f'{(percentage * 100):.2f}'        
        crimeCategory = getCrimeCategory(counter) 
        results[crimeCategory] = aPercentage
        counter += 1   
    
    return results    
    
# function which returns the probablity of crime types occuring 
# at a latitude and longitude location during the next month
def getProbability(month, year, lat, lon, sector):   
    
    # load KMeans cluster model for current sector
    clusterFile = 'kmini_models/KMini_' + sector + '.sav'    
    
    # load logistic regression model from file
    cluster_model = joblib.load(clusterFile)
    
    # set file location for logistic regression model
    logisticRegressionFile = 'logisticRegression_models/LogisticRegression_' + sector + '.sav'
 
    # load the model from the file
    logisticRegressionModel = joblib.load(logisticRegressionFile)
    
    # get cluster value for user search location lat and lon using KMeans cluster model
    cluster = cluster_model.predict([[lat, lon]])
   
    # create X features array as month, year, cluster value
    X = np.array([[year, month, cluster.item(0)]], dtype=np.float32)   
    
    # scale data
    X = logisticRegressionModel.scaler.transform(X) 
   
    # get reference to cluster value column
    cluster_col = X[:, [2]]
   
    # get one-hot version of cluster col
    oneHotEncodedCluster = logisticRegressionModel.encoder.transform(cluster_col).toarray()
        
    # recombine one-hot encoded cluster column back into array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))
    
    # get probability for crime categories
    prediction = logisticRegressionModel.predict_proba(X)[0] 
    
    #print(prediction); 
        
    # generate result object
    result = getResult(prediction)
   
    return result