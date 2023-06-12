import random
import copy
import os
from flask_cors import CORS
from selenium import webdriver

from flask import Flask,request,jsonify,render_template,send_file
from bs4 import BeautifulSoup
import base64
from cryptohash import md5
import socket
import re
import json
from collections import defaultdict
from matplotlib import colors as mcolors
import pandas as pd
import nltk
import math
import numpy as np

from flask import Flask, redirect, url_for, request, jsonify

from nltk.util import ngrams

from nltk import word_tokenize, sent_tokenize
import string
df = pd.read_excel('Book1.xlsx')

def defaultcolor():
    return 'FFFFFF'
# Creating pattern rows
patternRows = []
for row in range(df.shape[0]):
    newRow = ""
    for col in range(df.shape[1]):

        if not isinstance(df.iloc[row][col], float):
            newRow += df.iloc[row][col] + " "
    patternRows.append(newRow)
maxCols = df.shape[1]

# Function to apply laplace smoothing
def laplaceSmoothing(gramsFreqDist):
    for word in gramsFreqDist.keys():
        gramsFreqDist[word] += 1
    return gramsFreqDist

# Function to generate ngrams with demanded parameters
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

# Function to find propability distribution for ngrams
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

# Convert text to ngrams
def convert2Gram(pattern, gramVal):
    row_tokens = pattern.split(" ")
    gramTuples = ngrams(row_tokens, gramVal)
    lastVal = ()
    for gram in gramTuples:
        lastVal = gram
    return lastVal

# Find probability for ngrams
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

# Function to calcultate probability for each input pattern
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


# Generating and storing current user pattern
pattern=""
def make_pattern(testStr):
    global pattern
    pattern+=testStr
    pattern+=' '
    return pattern[0:-1]


def get_pattern():
    global pattern
    return pattern[0:-1]

app = Flask(__name__ )
CORS(app)

#tag = ""
#html = ""
#state = ""

# Login route to add users
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
# Responding requests with predictions
@app.route('/predictiondata', methods=['POST', 'GET'])
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

interactions = []
current_URL = ""
colors = defaultdict(defaultcolor)

IP = socket.gethostbyname(socket.getfqdn())
#IP = "0.0.0.0"
regex = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"
# Get Actions from users or client side
def get_Action(x,attr):
    s = x + "!@!"
    if x == 'input':
        try:
            s+=attr['name'].strip()+'!@!'
        except:
            s += 'nan!@!'
        try:
            s += attr["value"].strip() + '!@!'
        except:
            s += 'nan!@!'
        s += 'nan'

    elif x == 'button':
        s += 'nan!@!'  # name
        try:
            s+=attr["value"].strip() + '!@!'
        except:
            s += 'nan!@!'
        s += 'nan'
    elif x == 'a':
        s += 'nan!@!'  # name
        s += 'nan!@!'  # value
        try:
            s += attr['href'].strip()
        except:
            s += 'nan'
    elif x == 'select':
        try:
            s += attr['name'].strip() + '!@!'
        except:
            s += 'nan!@!'
        s += 'nan!@!'  # value
        s += 'nan'  # href
    return s

# Applying the reverse enginner action
def reverseEngineerAction(action):
    tag, name, value, href = action.split('!@!')
    xpath = '//' + tag + '['
    att = []
    hreflist = []
    pathlist = []
    XPATH = ""
    if name != 'nan':
        att.append('@name=' + '"' + name + '"')
    if value != 'nan':
        att.append('@value=' + '"' + value + '"')
    if href != 'nan':
        hreflist.append(href)
        for x in range(1, len(href.split("/"))):
            temphref = "/".join(href.split("/")[x::])
            hreflist.append(temphref)
            hreflist.append("../" + temphref)
            hreflist.append("/" + temphref)
    elem = None
    if hreflist == []:
        XPATH = xpath + " and ".join(att) + "]"
        pathlist.append(XPATH)
    else:
        for x in hreflist:
            _att = []
            _att.extend(att)
            _att.append("@href=" + "'" + x + "'")
            XPATH = xpath + " and ".join(_att) + "]"
            pathlist.append(XPATH)
        x = "#"
        _att = []
        _att.extend(att)
        _att.append("@href=" + "'" + x + "'")
        XPATH = xpath + " and ".join(_att) + "]"
        pathlist.append(XPATH)
    return pathlist
users = []
# Receiving data from client side and generating data for states
@app.route('/data',methods=["GET","POST"])
def dataReciever():
    #global tag, html, state
    global users
    data = request.json.get("key")
    state = request.json.get("state").strip()
    click_count = request.json.get("clickC")
    tag,html,id = data.split(":separator:")
    found = False
    for i in users:
        if i["id"] == id:
            found = True
            i["click"] = i["click"]+1
            click_count=i["click"]
    if not found:
        users.append({"id": id, "click": 1})

    element = BeautifulSoup(html, 'html.parser')
    attr = element.find().attrs
    actions = get_Action(tag.lower(), attr)
    color = ""
    while True:
        color = "#"+''.join([random.choice('0123456789ABCDEF') for j in range(6)])
        if color not in colors.values():
            break
    if colors[id]==defaultcolor():
        colors[id]=color
    interactions.append({"id":id,"action":actions,"state":md5(state),"color":colors[id],"clicks":click_count})

    return "ok"
# Sending all the user interactions data
@app.route('/getdata',methods=["GET","POST"])
def dataSender():

    if len(interactions)>0:
        temp = copy.deepcopy(interactions)

        def zero():
            return 0
        to_send = defaultdict(zero)
        for a in temp:
            to_send[a["action"]+":ASMAR:"+a["state"]]+=1

        user_clicks  = temp[-1]["clicks"]
        arr = []
        for x in to_send.keys():
            action, state = x.split(":ASMAR:")
            for t in temp:
                if t["action"]==action and t["state"]==state:
                    if to_send[x] > 1:
                        rgb = mcolors.to_rgb("#F2FFE5")
                        hsv = mcolors.rgb_to_hsv(rgb)
                        hsv[1] = to_send[x]/20
                        c = mcolors.to_hex(hsv)
                        arr.append({"id": t["id"], "action": action, "state": state,"color":c,"userClicks":user_clicks})
                    else:
                        
                        arr.append({"id": t["id"], "action": action, "state": state,"color":t["color"],"userClicks":user_clicks})

        return jsonify({"id":"res",'data':arr})
    else:
        return jsonify({"id":'ack'})

@app.route('/test',methods=["GET","POST"])
def hello_name():
   return "what"
# Resolving missing edges and nodes
@app.route('/missing',methods=["GET","POST"])
def missing_resolver():
    req_data = request.get_json()
    source = req_data["source"]
    target = req_data["target"]
    action = req_data["action"]
    print("Source ", source)
    print("target ", target)
    print("action ", action)
    with open("static/js/newdata.js") as f:
        s = f.read()
        L = eval(s[13::])
    for l in L:
        A = [dict(t) for t in {tuple(d.items()) for d in l["edges"]}]
        l["edges"] = A
        count = 0
    for src in L:
        #print(src)
        #src_data = json.loads(src)
        print("comparing: ",src["src"]," with ",source )
        if src["src"] == "2a37943c3d7117b3f16609f866c1e35f":
            for edge in src["edges"]:
                #ADD to new file here
                print(edge)
                print("Type action", type(action))
                print()
                to_add = {'action':action, 'state':target}
                src["edges"].append(to_add)
                print("to add: ",to_add)
    with open("static/js/temp_new.js","w") as f_wr:
        f_wr.write("let data = "+json.dumps(L))
    return "added missing source:{0}, Target:{1}, Action:{2}".format(source,target,action)
# Display simple node by rendering the index file
@app.route('/',methods=["GET","POST"])
def show_graph():
    """
    with open("./templates/index.html","r") as file:
        s = file.read()
        s = s.replace('const finalServerIp="";','const finalServerIp="'+IP+'";')
    with open("./templates/index.html","w") as file:
        file.write(s)

    with open("./templates/index.html", "r") as file:
        s = file.read()
        s = re.sub(regex, IP, s)

    with open("./templates/index.html","w") as file:
        file.write(s)
    """
    return render_template("index.html")
# Sending the crawler data of graph
@app.route('/graph')
def send():
    #return "<a href={0}>file</a>".format("{{ url_for('static', filename='js/grapash.json') }}")
    file = open("static/js/data.json")
    return file.read()


# @app.route('/append')
# def send():
#     #return "<a href={0}>file</a>".format("{{ url_for('static', filename='js/grapash.json') }}")
#     file = open("static/js/data.json")
#     return file.read()

# Display interactive graph by rendering the direct file
@app.route('/d3',methods=["GET","POST"])
def show_graphd3():
    """
    with open("./templates/index.html","r") as file:
        s = file.read()
        s = s.replace('const finalServerIp="";','const finalServerIp="'+IP+'";')
    with open("./templates/index.html","w") as file:
        file.write(s)

    with open("./templates/index.html", "r") as file:
        s = file.read()
        s = re.sub(regex, IP, s)

    with open("./templates/index.html","w") as file:
        file.write(s)
    """
    file = open("static/js/graph.json")
    print(file.read())
    return render_template("direct.html")

# Get the first image from the files
@app.route('/get_image')
def get_image():
    filename = request.args.get('name')
    with open("./data/Q_Result/"+filename, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
    #return send_file("./data/Q_Result/"+filename, mimetype='image/png')
    return jsonify({"data":encoded_string.decode("utf-8")})

# Get the second image from the files
@app.route('/get_image2')
def get_image2():
    filename = request.args.get('name')
    with open("./data/Q_Result/"+filename, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
    #return send_file("./data/Q_Result/"+filename, mimetype='image/png')
    return encoded_string.decode("utf-8")

# Get the source code from the files
@app.route('/get_File')
def get_file():
    filename = request.args.get('name')
    with open("./data/Q_Result/"+filename, "r") as image_file:
        encoded_string = image_file.read()
    #return send_file("./data/Q_Result/"+filename, mimetype='image/png')
    return jsonify({"data":encoded_string})


arrayOfErrorDetails=[]  #For saving Error Description.
arrayOfErrors=[]    #For saving interactions.
# generating the list of errors detected
@app.route('/error',methods=["GET","POST"])
def caughtError():
    data = request.get_json()
    title = data['error']
    desc = data['description']
    print(title)
    print(desc)
    
    titleDesc=[]
    titleDesc.append(title)
    titleDesc.append(desc)

    arrayOfErrorDetails.append(titleDesc)

    if len(interactions) == 0:
         pass
    else:
        arrayOfErrors.append(interactions[-1])
        

    # do something with the title and desc values
    return jsonify({'status': 'success'})

# Get the interactions of all the actions performed
@app.route('/getInteraction',methods=["GET","POST"])
def getinteraction():
    if len(interactions) == 0:
        return "1"
    else:
        print(arrayOfErrors)
        return jsonify(arrayOfErrors)
# Get detected errors details
@app.route('/getErrorDetails',methods=["GET","POST"])
def getErrorDetails():
    if len(arrayOfErrorDetails) == 0:
        return "1"
    else:
        return jsonify(arrayOfErrorDetails)
# Find and send the current state URL
@app.route('/getURL',methods=["GET","POST"])
def URLgetter():
    global current_URL
    current_URL = request.json.get("pageURL")
    return "URL received"
# Generating the image and html for newly explored node
def imageAndHtml(url,fileName='screenshot.html',output_dir='./data/Q_Result'):

    driver = webdriver.Firefox()
    # Navigate to the localhost website
    driver.get(url)
    print("Current URL of site: ", url)
    print("Current State : ",fileName)

    # Take a screenshot of the webpage and save it in the specified directory
    driver.save_screenshot(os.path.join(output_dir, fileName+".png"))

    with open(os.path.join(output_dir, fileName+".html"), 'w', encoding='utf-8') as htmlwriter:
        htmlwriter.write(driver.page_source)

    driver.quit()
    return "yes"
# Check whether the files exist or not
@app.route('/createImgHtml',methods=["GET","POST"])
def createImageHtml():
    newFilename = request.args.get("stateName")
    directory = "./data/Q_Result"
    file_path = os.path.join(directory, newFilename+".png")
    if os.path.exists(file_path):
        return jsonify({"completed":"yes"})

    imageAndHtml(current_URL,newFilename)
    return jsonify({"completed":"yes"})
    # except:
    #     return jsonify({"completed":"no"})
    




    
            

if __name__ == '__main__':
    #app.run(port=8484,host="192.168.1.204")
    app.run(port=8484,host=IP)
