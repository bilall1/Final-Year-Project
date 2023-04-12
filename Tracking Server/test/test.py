import json

if __name__ == '__main__':
    with open("static/js/data.js","r") as file:
        s = file.read()
        L = eval(s[11::])

    for l in L:
        A = [dict(t) for t in {tuple(d.items()) for d in l["edges"]}]
        l["edges"] = A


    with open("static/js/newdata.js","w") as file:
        file.write("let data = "+str(L))
    # dictionary = {
    #     "id": "04",
    #     "name": "sunil",
    #     "depatment": "HR"
    # }

    # Serializing json
    json_object = json.dumps(L, indent=4)


    with open("static/js/newdata2.json","w") as file:
        file.write(str(json_object))