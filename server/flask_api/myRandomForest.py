#!/usr/bin/env python
# coding: utf-8
#from sklearn import *
import numpy as np
#from classifier.location_filtering import is_within_m25
import joblib
#from datetime import datetime

#from shapely.geometry import Point
#from shapely.geometry.polygon import Polygon
#import matplotlib.pyplot as plt

#returns the crime category for a given crime value
def getCrimeCategory(aCrimeValue):     
    if(aCrimeValue == 0):    
        return 'Anti-social behaviour' #anti-social behaviour
    if(aCrimeValue == 1):      
        return 'Theft' #theft
    if(aCrimeValue == 2):   
        return 'Burglary' #burglary
    if(aCrimeValue == 3):   
        return 'Criminal damage and arson' #criminal damage
    if(aCrimeValue == 4):   
        return 'Drugs' #drugs
    if(aCrimeValue == 5):   
        return 'Public order' #public order
    if(aCrimeValue == 6):   
        return 'Possession of weapons' #weapons
    if(aCrimeValue == 7): 
        return 'Violent crime'  #violent crime   
    if(aCrimeValue == 8):   
        return 'Vehicle crime' #vehicle  


#function which returns a crime probablity prediction score
# for a given location and month
def getResult(data):    

    #set filename of model
    filename = 'RandomForest_FINAL.sav'
    
    #load the model from the file
    myClassifier = joblib.load(filename)
    predictions = myClassifier.predict_proba(data)[0]
    results = {} #to be returned to web app
    counter = 0

    for percentage in predictions:  
        aPercentage = f'{(percentage * 100):.2f}'
        aPercentage = str(aPercentage + '%')
        crimeCategory = getCrimeCategory(counter)
        results[crimeCategory] = aPercentage
        counter += 1      
         
    return results
    
    
#function which returns the probablity of crime types occuring for a month and location
def getProbability(month, year, lat, lon):    
    
    print('getProbability RECEVED: ')
    print(str(month))
    print(str(year))
    print(str(lat))
    print(str(lon))
    print('-------------------------------------------')


    #check location lat and lon is within bounds of area
    #if not is_within_m25(parsed_address.latitude, parsed_address.longitude):
       # raise ValueError('The provided address is not within the London/M25 region')

    #load models
    aLat = lat  #TODO NEEDS WORK
    aLon = lon
    
    #load previsouly saved KMeans cluster model 
    clusterFile = 'KMeansCluster.sav'
    
    # Load the model from the file
    cluster_model = joblib.load(clusterFile)
    
    # Save the model as a pickle in a file
    randomForestFile = 'RandomForestModel.sav'
 
    # Load the model from the file
    randomForestModel = joblib.load(randomForestFile)
    
    #get cluster value for current search location lat and lon using cluster model
    cluster = cluster_model.predict([[aLat, aLon]])
    print('\n===CLUSTER==VALUE===')
    print(cluster.item(0))
    print('-------------------------------------------')

    #create X featuresarray month, year, cluster value
    X = np.array([[month, year, cluster.item(0)]], dtype=np.float64)
    print('\n===X should hold month, year, cluster===')
    print(X)
    print('-------------------------------------------')



    #scale data
    X = randomForestModel.scaler.transform(X) #scale feature data

    #one-hot encoding of cluster value  
    #print('\n===X should hold month, year, cluster===')
  
    cluster_col = X[:, [2]]
    #print(cluster_col)
    
    #get one-hot version of location
    oneHotEncodedCluster = randomForestModel.encoder.transform(cluster_col).toarray()
    
    #combine data back into array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))
    print(X)
    #get percentages in decimal form for y categories of theft, serious crime, 
    #minor and other crime,for provided X values supplied
    
    #get probability for crime categories
    #prediction = randomForestModel.model.predict_proba(X)[0] 
    prediction = randomForestModel.predict_proba(X)[0] 

    print('\n') 
    print('prediction value is: ' + str(prediction)) 
    #[   0.39248285             0.29265046                     0.31486669]
    #theft 39.25%, serious crime: 29.27%, minor and other crime: 31.49%
    print('\n') 

    #generate result object
    result = getResult(prediction)
   
    #return result
    return result