#!/usr/bin/env python
# coding: utf-8
#from sklearn import *
import numpy as np
#from classifier.location_filtering import is_within_m25
import joblib
import json
#from datetime import datetime

#from shapely.geometry import Point
#from shapely.geometry.polygon import Polygon
#import matplotlib.pyplot as plt

#TODO this string may not aline with node js routes js - align all crimes and values
#returns the crime category for a given crime value
def getCrimeCategory(aCrimeValue):     
    if(aCrimeValue == 0):    
        return 'Anti_social_behaviour' #anti-social behaviour
    if(aCrimeValue == 1):      
        return 'Theft' #theft
    if(aCrimeValue == 2):   
        return 'Burglary' #burglary
    if(aCrimeValue == 3):   
        return 'Criminal_damage_and_arson' #criminal damage
    if(aCrimeValue == 4):   
        return 'Drugs' #drugs
    if(aCrimeValue == 5):   
        return 'Public_order' #public order
    if(aCrimeValue == 6):   
        return 'Possession_of_weapons' #weapons
    if(aCrimeValue == 7): 
        return 'Violent_crime'  #violent crime   
    if(aCrimeValue == 8):   
        return 'Vehicle_crime' #vehicle  


#function which returns a crime probablity prediction score
# for a given location and month
def getResult(data):    

    #set filename of model
   # filename = 'RandomForestModel.sav'
    
    #load the model from the file 
   # myClassifier = joblib.load(filename)
   # predictions = myClassifier.predict_proba(data)[0]

    results = {} #to be returned to web app
    counter = 0

    for percentage in data:  
        aPercentage = f'{(percentage * 100):.2f}'
        aPercentage = str(aPercentage + '%')
        crimeCategory = getCrimeCategory(counter)
        results[crimeCategory] = aPercentage
        counter += 1   
    
    return results
    
    
#function which returns the probablity of crime types occuring for a month and location
def getProbability(month, year, lat, lon):    
    
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
    
    # Save the model as a file
    randomForestFile = 'RandomForestModel.sav'
 
    # Load the model from the file
    randomForestModel = joblib.load(randomForestFile)
    
    #get cluster value for current search location lat and lon using cluster model
    cluster = cluster_model.predict([[aLat, aLon]])
   
    #create X featuresarray month, year, cluster value
    X = np.array([[year, month, cluster.item(0)]], dtype=np.float64)       

    #scale data
    X = randomForestModel.scaler.transform(X) #scale feature data
   
    #year month cluster
    cluster_col = X[:, [2]]
   
    #get one-hot version of location
    oneHotEncodedCluster = randomForestModel.encoder.transform(cluster_col).toarray()
        
    #combine data back into array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))
   
    #get percentages in decimal form for y categories of theft, serious crime, 
    #minor and other crime,for provided X values supplied
    
    #get probability for crime categories
    #prediction = randomForestModel.model.predict_proba(X)[0] 
    prediction = randomForestModel.predict_proba(X)[0] 
       
    print('prediction value is: ' + str(prediction)) 
   
    #[   0.39248285             0.29265046                     0.31486669]
    #theft 39.25%, serious crime: 29.27%, minor and other crime: 31.49%
    print('\n') 
    
    #generate result object
    result = getResult(prediction)
   
    return result