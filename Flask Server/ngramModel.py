import pandas as pd
import nltk
import math
import numpy as np

from flask import Flask, redirect, url_for, request, jsonify

from nltk.util import ngrams

from nltk import word_tokenize, sent_tokenize
import string
df = pd.read_excel('Book1.xlsx')

patternRows = []
for row in range(df.shape[0]):
    newRow = ""
    for col in range(df.shape[1]):

        if not isinstance(df.iloc[row][col], float):
            newRow += df.iloc[row][col] + " "
    patternRows.append(newRow)
maxCols = df.shape[1]


def laplaceSmoothing(gramsFreqDist):
    for word in gramsFreqDist.keys():
        gramsFreqDist[word] += 1
    return gramsFreqDist


def generateNgrams(totalGrams, patternRows):

    all_nGrams = []
    all_nGrams_distributions = []
    for gramVal in range(2, totalGrams+1):
        # list containg all grams with frequencies like all bigrams or trigrams
        combinedGramsList = []

        for eachRow in patternRows:
            row_tokens = eachRow.split(" ")
            # creating n-grams of each record
            gramTuples = ngrams(row_tokens, gramVal)

            for gram in gramTuples:
                combinedGramsList.append(gram)

        remove_values = [""]
        filteredGrams = [gram for gram in combinedGramsList if not any(
            stop in gram for stop in remove_values)]  # Removing tuples with empty string
        # creating frequency distribution  of n-grams
        gramsFreqDist = nltk.FreqDist(filteredGrams)
        print("Total number of unique {} grams : {}".format(
            gramVal, gramsFreqDist.B()))

        gramsFreqDist = laplaceSmoothing(gramsFreqDist)

        grams2freq = gramsFreqDist.most_common(
            gramsFreqDist.B())

        all_nGrams.append(grams2freq)
        all_nGrams_distributions.append(gramsFreqDist)
    return all_nGrams, all_nGrams_distributions


def createProbabilityDistribution(freq_dist):

    all_nGramProbs = []
    for gramVal in range(len(freq_dist)):

        nGramProbs = {"Word": [], "Probability": []}
        gram_voc = set(freq_dist[gramVal])
        total_freq = 0
        for key in freq_dist[gramVal].keys():
            total_freq += freq_dist[gramVal][key]

        for key in freq_dist[gramVal].keys():
            probability = (freq_dist[gramVal][key] /
                           (total_freq + len(gram_voc)))
            nGramProbs["Word"].append(key)
            nGramProbs["Probability"].append(probability)

        all_nGramProbs.append(nGramProbs)
    return all_nGramProbs


def convert2Gram(pattern, gramVal):
    row_tokens = pattern.split(" ")
    gramTuples = ngrams(row_tokens, gramVal)
    lastVal = ()
    for gram in gramTuples:
        lastVal = gram
    return lastVal


def findGramProbability(tup, gramVal, all_prob_dists):
    if (gramVal-2 < len(all_prob_dists) and gramVal-2 > -1):
        gVal = gramVal-2
        for word in range(len(all_prob_dists[gVal]["Word"])):

            # print(all_prob_dists[gVal]["Probability"][word])
            if all_prob_dists[gVal]["Word"][word] == tup:
                # print("{} with {}".format(all_prob_dists[gVal]["Word"][word], tup))
                return all_prob_dists[gVal]["Probability"][word]

        return 0
    else:
        return 0


all_nGrams, all_nGrams_distributions = generateNgrams(maxCols, patternRows)
all_prob_dists = createProbabilityDistribution(all_nGrams_distributions)


def predictProb(test_row, probDist, cols):
    test_tokens = test_row.split(" ")
    test_len = len(test_tokens)
    # all_classes = ["store", "cart", "order",
    #                "help", "share"]        # add all classes
    all_classes = ["product",
"search",
"cart",
"update",
"add",
"login",
"logout",
"account",
"track",
"category",
"checkout",
"pay",
"wishlist",
"review",
"quantity",
"description",
"continue"]
    class_probs = []
    alpha = 0.01
    for eachClass in all_classes:

        totalProb = 0
        rowClass = test_row + " " + eachClass
        for iter in range(2, min(test_len + 2, cols + 1)):
            test_gram = convert2Gram(rowClass, iter)
            prob = findGramProbability(test_gram, iter, probDist)
            totalProb += pow(2, iter) * prob
        totalProb *= alpha
        class_probs.append(totalProb)

    return all_classes, class_probs


test_row = "share deal"
class_names, class_probs = predictProb(test_row, all_prob_dists, maxCols)
print(class_names)
print(class_probs)


pattern=""
def make_pattern(testStr):
    global pattern
    pattern+=testStr
    pattern+=' '
    return pattern[0:-1]


def get_pattern():
    global pattern
    return pattern[0:-1]


app = Flask(__name__)

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':

        user = request.form['testString']
        return redirect(url_for('success', name=user))
    else:
        print(get_pattern())
        testStr = request.args.get('testString')
        classNames, classProbs = predictProb(
            make_pattern(testStr), all_prob_dists, maxCols)
        return jsonify(
            classes=classNames,
            probs=classProbs
        )

@app.route('/data', methods=['POST', 'GET'])
def data():
    if request.method == 'POST':

        user = request.form['testString']
        return redirect(url_for('success', name=user))
    else:
        print(get_pattern())
        # testStr = request.args.get('testString')
        classNames, classProbs = predictProb(
            get_pattern(), all_prob_dists, maxCols)
        return jsonify(
            classes=classNames,
            probs=classProbs
 )


if __name__ == '__main__':
    app.run(debug=False)
