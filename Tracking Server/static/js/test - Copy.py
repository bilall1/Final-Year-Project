import json
import difflib

if __name__ == '__main__':
    graphDict= {}
    doneStates = []
    with open("data.js","r") as file:
        s = file.read()
        L = eval(s[11::])

    for l in L:
        A = [dict(t) for t in {tuple(d.items()) for d in l["edges"]}]
        l["edges"] = A
    
    for src in L:

        if src["src"] not in doneStates:
            if(len(doneStates) == 0):
                print(src["src"])
                graphDict["name"] = src["src"]
                graphDict["children"] = [dict(child) for child in src["edges"]]
                doneStates.append(src["src"])
            else:
                for child in graphDict["children"]:
                    new_key = "name"
                    old_key = "state"
                    print(child)
                    value = child.pop(old_key)
                    
                    child[new_key] = value
                    #child.pop(old_key)
                # for child in graphDict["children"]:
                #     # new_key = "name"
                #     # old_key = "state"
                #     # print(child)
                #     # child[new_key] = child[old_key]
                #     #child.pop(old_key)
    
    with open("tester.js","w") as file:
        file.write("let data = "+str(graphDict))

        
    # for key, value in L.items() :
    #     print (key, value)

        # output_list = [li for li in difflib.ndiff(comp1, comp2) if li[0] != ' ']
        # for k in output_list:
        #     print(k)
    # with open("newdata2.js","w") as file:
    #     file.write("let data = "+str(L))

    # # dictionary = {
    # #     "id": "04",
    # #     "name": "sunil",
    # #     "depatment": "HR"
    # # }
    
    # # Serializing json
    # json_object = json.dumps(L, indent=4)


    # with open("static/js/newdata2.json","w") as file:
    #     file.write(str(json_object))