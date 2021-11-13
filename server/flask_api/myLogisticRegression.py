import numpy as np
import joblib

# function which returns the crime category for a given crime value
def getCrimeCategory(aCrimeValue):
    if aCrimeValue == 0:
        return "Anti-social behaviour"  # anti-social behaviour
    if aCrimeValue == 1:
        return "Burglary"  # burglary
    if aCrimeValue == 2:
        return "Criminal damage and arson"  # criminal damage
    if aCrimeValue == 3:
        return "Drugs"  # drugs
    if aCrimeValue == 4:
        return "Possession of weapons"  # weapons
    if aCrimeValue == 5:
        return "Public order"  # public order
    if aCrimeValue == 6:
        return "Robbery"  # robbery
    if aCrimeValue == 7:
        return "Shoplifting"  # shop lifting
    if aCrimeValue == 8:
        return "Theft"  # theft
    if aCrimeValue == 9:
        return "Vehicle crime"  # vehicle
    if aCrimeValue == 10:
        return "Violent crime"  # violent crime


# function which formats crime prediction occurrences into an object
def addTotals(crimePercentages, totalNumberCrimes):

    results = {}
    counter = 0

    # iterate over crime ratio predictions and format to 2 decimal places
    for percentage in crimePercentages:
        crimeCategory = getCrimeCategory(counter)  # get crime type

        # TODO test weighting factors
        # adjust weighting factor to scale crime model
        # weightingFactor = 1;
        # if(crimeCategory == 'Anti-social behaviour' or crimeCategory == 'Violent crime'):
        #    weightingFactor = 1.3;
        # occurrences = round(percentage * (totalNumberCrimes / weightingFactor)) # set occurrences of this crime

        occurrences = round(
            percentage * totalNumberCrimes
        )  # set occurrences of this crime

        # print('==========  TOTAL CRIMES PREDICTED: ' + str(totalNumberCrimes) + '  ========')
        # print('Occurrences calculation: (' + str(percentage)
        #       + '%)  *  (' + str(totalNumberCrimes) + '/' + ')')

        results[crimeCategory] = occurrences  # add to result object
        counter += 1

    return results


# function which generates an object with crime types and crime percentage ratios
def addPercentages(crimePercentages):

    results = {}
    counter = 0

    # iterate over crime predictions and format to 2 decimal places
    for percentage in crimePercentages:
        aPercentage = f"{(percentage * 100):.2f}"
        crimeCategory = getCrimeCategory(counter)
        results[crimeCategory] = aPercentage
        counter += 1

    return results


# function which predicts the percentage ratio of each crime type occurring within
# a cluster area that encompasses a latitude and longitude location,
# for the next calender month
def getPredictions(month, year, lat, lon, sector):

    # set KMeans cluster model filename for current sector
    clusterFilename = "kmini_models/KMini_" + sector + ".sav"

    # load KMeans cluster model from file
    cluster_model = joblib.load(clusterFilename)

    # set filename for logistic regression ratio prediction model for sector
    LR_Ratio_Filename = "logisticRegression_models/LR_Ratio_" + sector + ".sav"

    # load the logistic regression ratio model from file
    LR_Ratio_Model = joblib.load(LR_Ratio_Filename)

    # set filename for logistic regression occurrences model for sector
    LR_Occurrence_Filename = (
        "logisticRegression_models/LR_Occurrence_" + sector + ".sav"
    )

    # load the logistic regression occurrences model from file
    LR_Occurrence_Model = joblib.load(LR_Occurrence_Filename)

    # get cluster value for lat/lon location using KMeans cluster model
    cluster = cluster_model.predict([[lat, lon]])

    # create X features array as month, year, cluster
    X = np.array([[year, month, cluster.item(0)]], dtype=np.float32)

    crimePercentageRatios = predictCrimeRatios(X, LR_Ratio_Model)
    totalNumberOfCrimes = predictNumberCrimes(X, LR_Occurrence_Model)

    # generate formatted result object
    result = {}
    result["totals"] = addTotals(crimePercentageRatios, totalNumberOfCrimes)
    result["percentages"] = addPercentages(crimePercentageRatios)
    print("percentages set to: " + str(result["totals"]))

    return result


# function which predicts the percentage ratio of crime types that will occur
def predictCrimeRatios(X, LR_Model):

    # scale feature data
    X = LR_Model.scaler.transform(X)

    # get cluster col
    cluster_col = X[:, [2]]

    # one-hot-encode cluster col
    oneHotEncodedCluster = LR_Model.encoder.transform(cluster_col).toarray()

    # recombine one-hot-encoded cluster column back into feature array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))

    # predict ratio of crime types as a percentage of all crime type
    percentages = LR_Model.predict_proba(X)[0]

    return percentages


# function which predicts the total number of crimes that will occur
def predictNumberCrimes(X, LR_Model):

    # scale feature data
    X = LR_Model.scaler.transform(X)

    # get cluster col
    cluster_col = X[:, [2]]

    # one-hot-encode cluster col
    oneHotEncodedCluster = LR_Model.encoder.transform(cluster_col).toarray()

    # recombine one-hot-encoded cluster column back into feature array
    X = np.hstack((X[:, :2], oneHotEncodedCluster))

    # predict total number of crimes that will occur
    totalNumberofCrimes = LR_Model.predict(X)[0]

    return totalNumberofCrimes
