import random
import copy

from flask import Flask,request,jsonify,render_template,send_file
from bs4 import BeautifulSoup
import base64
from cryptohash import md5
import socket
import re
from collections import defaultdict
from matplotlib import colors as mcolors

def defaultcolor():
    return 'FFFFFF'

app = Flask(__name__ )

#tag = ""
#html = ""
#state = ""

interactions = []
colors = defaultdict(defaultcolor)

IP = socket.gethostbyname(socket.getfqdn())
regex = "^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$"
# finding the user action performed
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

# applying the reverse enngineering action
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

# getting state data and adding user colors + state hash
@app.route('/data',methods=["GET","POST"])
def dataReciever():
    #global tag, html, state
    data = request.json.get("key")
    state = request.json.get("state").strip()
    tag,html,id = data.split(":separator:")
    element = BeautifulSoup(html, 'html.parser')
    attr = element.find().attrs
    print(attr)
    actions = get_Action(tag.lower(), attr)
    #path = reverseEngineerAction(actions)
    color = ""
    while True:
        color = "#"+''.join([random.choice('0123456789ABCDEF') for j in range(6)])
        if color not in colors.values():
            break
    if colors[id]==defaultcolor():
        colors[id]=color
    interactions.append({"id":id,"action":actions,"state":md5(state),"color":colors[id]})
    print("reveived")
    return "ok"

# Function to get interaction and pre-processing it to make it distinct
@app.route('/getdata',methods=["GET","POST"])
def dataSender():

    if len(interactions)>0:
        temp = copy.deepcopy(interactions)
        def zero():
            return 0
        to_send = defaultdict(zero)
        for a in temp:
            to_send[a["action"]+":ASMAR:"+a["state"]]+=1


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
                        arr.append({"id": t["id"], "action": action, "state": state,"color":c})
                    else:
                        arr.append({"id": t["id"], "action": action, "state": state,"color":t["color"]})

        return jsonify({"id":"res",'data':arr})
    else:
        return jsonify({"id":'ack'})

@app.route('/test',methods=["GET","POST"])
def hello_name():
   return "what"
# Draw basic graph with static data
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


# Getting images from files and responding to requests
@app.route('/get_image')
def get_image():
    filename = request.args.get('name')
    with open("./data/Q_Result/"+filename, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read())
    #return send_file("./data/Q_Result/"+filename, mimetype='image/png')
    return jsonify({"data":encoded_string.decode("utf-8")})

# Getting Source code from Files
@app.route('/get_File')
def get_file():
    filename = request.args.get('name')
    with open("./data/Q_Result/"+filename, "r") as image_file:
        encoded_string = image_file.read()
    #return send_file("./data/Q_Result/"+filename, mimetype='image/png')
    return jsonify({"data":encoded_string})

if __name__ == '__main__':
    #app.run(port=8484,host="192.168.1.204")
    app.run(port=8484,host=IP)
