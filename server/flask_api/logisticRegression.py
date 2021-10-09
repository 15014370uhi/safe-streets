import pandas as pd
import numpy as np
import joblib
import glob
import timeit
from datetime import datetime

# sklearn model
from sklearn.linear_model import LogisticRegression

# sklearn utils
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import accuracy_score
from sklearn.pipeline import make_pipeline
#from sklearn.model_selection import cross_val_score

# set array to hold sector definitions
sectors = [
    {  # 6 * police forces - cleveland, cumbria, durham, lancashire, northumbria, n.yorkshire
        'sector': 'Sector1'
    },
    {  # 9 * police forces - cheshire, derbyshire, greater manchester, humberside,
        #lincolnshire, merseyside, nottinghamshire, s.yorkshire, w.yorkshire
        'sector': 'Sector2'
    },
    {  # 7 * police forces - gloucestershire, leicestershire, northamptonshire, staffordshire, warwickshire,
        # west mercia, west midlands
        'sector': 'Sector3'
    },
    {  # 7 * police forces - bedfordshire, cambridgeshire, essex, hertfordshire, norfolk, suffolk, thames valleuy
        'sector': 'Sector4'
    },
    {  # (london) - 2 * police forces - city of london, metropolitan
        'sector': 'Sector5'
    },
    {  # 8 * police forces - wiltshire, sussex, surrey, kent, hampshire, dorset, devon and cornwall,
        #avon and sumerset
        'sector': 'Sector6'
    }
]

# function which reads all csv files in a folder and returns a dataframe representation
def getCSVData(aSector):

    # declare variable to hold data frame
    df = pd.DataFrame()

    # declare variable to hold cleaned CSV data
    cleanedData = []

    # define file path
    pathname = "data/" + aSector + "/*.csv"
    allFiles = []

    for file in glob.iglob(pathname, recursive=True):
        allFiles.append(file)

    # for each CSV file in specified path
    for aFile in allFiles:

        # reading CSV data
        CSVData = pd.read_csv(
            aFile, usecols=['Month', 'Crime type', 'Latitude', 'Longitude'])

        # filter out any CSV rows with missing data
        CSVData = CSVData.loc[pd.notna(CSVData['Month'])
                              & pd.notna(CSVData['Crime type'])
                              & pd.notna(CSVData['Latitude'])
                              & pd.notna(CSVData['Longitude'])]

        # append data to array of all data
        cleanedData.append(CSVData)

    # convert to data frame
    df = pd.concat(cleanedData)

    # return the data frame
    return df

# function which converts a crime category to a number value
def getCrimeValue(aCrime):
    if(aCrime == 'Anti-social behaviour'):
        return 0  # anti-social behaviour
    if(aCrime == 'Bicycle theft'
       or aCrime == 'Other theft'
       or aCrime == 'Shoplifting'):
        return 1  # theft
    if(aCrime == 'Burglary'):
        return 2  # burglary
    if(aCrime == 'Criminal damage and arson'):
        return 3  # criminal damage
    if(aCrime == 'Drugs'):
        return 4  # drugs
    if(aCrime == 'Public order'
       or aCrime == 'Other crime'):
        return 5  # public order
    if(aCrime == 'Possession of weapons'):
        return 6  # weapons
    if(aCrime == 'Violent crime'
       or aCrime == 'Theft from the person'
       or aCrime == 'Robbery'
       or aCrime == 'Violence and sexual offences'):
        return 7  # violent crime
    if(aCrime == 'Vehicle crime'):
        return 8  # vehicle

# returns the crime category for a given crime value
def getCrimeCategory(aCrimeValue):
    if(aCrimeValue == 0):
        return 'Anti-social behaviour'  # anti-social behaviour
    if(aCrimeValue == 1):
        return 'Theft'  # theft
    if(aCrimeValue == 2):
        return 'Burglary'  # burglary
    if(aCrimeValue == 3):
        return 'Criminal damage and arson'  # criminal damage
    if(aCrimeValue == 4):
        return 'Drugs'  # drugs
    if(aCrimeValue == 5):
        return 'Public order'  # public order
    if(aCrimeValue == 6):
        return 'Possession of weapons'  # weapons
    if(aCrimeValue == 7):
        return 'Violent crime'  # violent crime
    if(aCrimeValue == 8):
        return 'Vehicle crime'  # vehicle

# format data
def formatData(df, clusterModel):

    # get year value from date element
    df['Year'] = df['Month'].apply(lambda month:
                                   datetime.strptime(month, '%Y-%m').year)

    # get month element from date element
    df['Month'] = df['Month'].apply(lambda month:
                                    datetime.strptime(month, '%Y-%m').month)

    # use kmeans to identify cluster for each lat and lon coordinate and assign cluster value
    df['Cluster'] = df.apply(lambda row:
                             clusterModel.predict([[row['Latitude'], row['Longitude']]]).item(0), axis=1)

    # drop lat and lon cols from dataframe
    df = df.drop(['Latitude', 'Longitude'], axis=1)

    # convert crime categories into numerical values
    df['Crime type'] = df['Crime type'].apply(getCrimeValue)

    # rearrange cols
    df = df[['Year', 'Month', 'Cluster', 'Crime type']]

    # cast data to int16 to save memory
    df['Year'] = df['Year'].astype('int16')
    df['Month'] = df['Month'].astype('int16')
    df['Cluster'] = df['Cluster'].astype('int16')
    df['Crime type'] = df['Crime type'].astype('int16')

    return df

# get X and y data sets
def convertToNP(aDataFrame):

    # convert dataframe to numpy array with floats (dummy)
    npArray = aDataFrame.to_numpy().astype(np.float32)

    # shuffle data
    np.random.shuffle(npArray)

    # return columns as X (Year, Month, Cluster), y (Crime type)
    return npArray[:, :3], npArray[:, 3]


# store CSV file data as dataframe for each sector
for record in sectors:
    print('\n\n=========== ' + record['sector'] + ' ===========')
    print('Reading ' + record['sector'] + ' CSV files...')
    start = timeit.default_timer()
    record['df'] = getCSVData(record['sector'])
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}' 
    print('Complete in: ' + str(timeTaken) + ' seconds\n') 

    # load KMeans cluster model for each sector
    filename = 'KMini_' + record['sector'] + '.sav'
    record['kMini_Model'] = joblib.load(filename)
    print('loaded', filename + ' KMini model, with clusters:' +
          str(record['kMini_Model'].n_clusters))

    # format data
    print('Formatting data...')
    start = timeit.default_timer()
    record['df'] = formatData(record['df'], record['kMini_Model'])
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}' 
    print('Complete in: ' + str(timeTaken) + ' seconds\n')  

    # get X and y data
    print('Storing X,y features and values...')
    start = timeit.default_timer()
    X, y = convertToNP(record['df'])
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}' 
    print('Complete in: ' + str(timeTaken) + ' seconds\n')  

    # create classifier pipeline and scale X values
    print('Creating classifier and scaling X values...')
    start = timeit.default_timer()
    classifier = make_pipeline(StandardScaler(), LogisticRegression(
        solver='lbfgs', max_iter=1000, random_state=0))
    classifier.scaler = StandardScaler()
    classifier.scaler.fit(X)
    X = classifier.scaler.transform(X)
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}'  
    print('Complete in: ' + str(timeTaken) + ' seconds\n')  

    # one-hot encode
    print('One-Hot encoding X features...')
    start = timeit.default_timer()
    clusters = X[:, [2]]
    classifier.encoder = OneHotEncoder(sparse=True)
    one_hot_encoded_location = classifier.encoder.fit(clusters)
    encodedClusters = classifier.encoder.fit_transform(clusters).toarray()
    
    # reintegrate one-hot encoded values to X
    X = np.hstack((X[:, :2], encodedClusters))
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}'  
    print('Complete in: ' + str(timeTaken) + ' seconds\n')  

    # split into train and test data for features and target
    print('Test/train data splitting...')
    start = timeit.default_timer()
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1)
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}' 
    print('Complete in: ' + str(timeTaken) + ' seconds\n')  

    # train model
    print('Training model with X_train / y_train...')
    start = timeit.default_timer()
    classifier.fit(X_train, y_train)
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}' 
    print('Complete in: ' + str(timeTaken) + ' seconds\n')  

    # make predictions for the test set
    print('Getting prediction percentage score using test data...')
    start = timeit.default_timer()
    y_pred_test = classifier.predict(X_test)

    # view accuracy score
    accuracyPercentage = accuracy_score(y_test, y_pred_test)
    print('Accuracy score using test data: ' + str(accuracyPercentage))
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}'  
    print('Complete in: ' + str(timeTaken) + ' seconds\n')    

    # testing prediction probability
    print('Predict probabilities for crime types using X_test data')
    start = timeit.default_timer()
    predictions = classifier.predict_proba(X_test)[0]
    stop = timeit.default_timer()
    timeTaken = f'{(stop - start):.2f}'
    print('Complete in: ' + str(timeTaken) + ' seconds\n')

    results = {}
    counter = 0
    mostLikelyCrime = ''

    highestPercentage = f'{(np.amax(predictions) * 100):.2f}'

    # display prediction
    print('Crime prediction percentages for this month: ' + '\n')
    for percentage in predictions:
        aPercentage = f'{(percentage * 100):.2f}'

        # get name of highest percentage crime category
        if aPercentage == highestPercentage:
            mostLikelyCrime = getCrimeCategory(counter)

        aPercentage = str(aPercentage + '%')
        crimeCategory = getCrimeCategory(counter)
        results[crimeCategory] = aPercentage
        counter += 1

    print('\nMost likely crime: ' + mostLikelyCrime +
          ' ' + str(highestPercentage) + '%')
    print(str(results))

    # save model to file
    filename = 'LogisticRegression_' + record['sector'] + '.sav'
    joblib.dump(classifier, filename)
    print('Saved logistic regression model: ' + filename)

    # #get cross validation score
    # print('Calculating cross validation score...')
    # start = timeit.default_timer()
    # cv_results = cross_val_score(classifier, X, y, cv=5, scoring='accuracy')
    # print(cv_results.mean())
    # stop = timeit.default_timer()
    # timeTaken = f'{(stop - start):.2f}' #stop - start
    # print('Complete in: ' + str(timeTaken) + ' seconds\n') #{timeTaken:.2f}
    
    # test load of the model from the file
    #myClassifier = joblib.load(filename)
    # print(myClassifier)

print('========--- FINISHED ---========')
