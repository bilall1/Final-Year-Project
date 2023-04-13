We are trying to create a universal assistant for testers. It will make the exploratory testing process more efficient in the industry. Since we are using machine learning in the creation of this tool we are limited to a single domain. The domain we will be focusing on is e-commerce websites.

How to Run code:

1.	You need an open source E-commerce Website. (You can use given Shopping website in the Folder).
2.	If any other website other than the one provided is used a web crawler will be required. Use this link for web crawler "https://github.com/salmansherin/QExplore"
3.	Perform next three steps if web crawler used otherwise skip them.
4.	Run the web crawler to create data of the website.
5.	After web crawler has completed exploring copy the "data.js" and "cytoscape.min.js" files from data/Q_result folder and paste into static/js folder.
6.	Replace any existing files with same name and create copy of data.js and rename it "newdata.js" and paste into same folder.
7.	Run "main.py" file using vs Code or CMD.
8.	Upon running the server will generate an IP address.
9.	Use that IP on any web browser and it will lead to a graph which will show the website pages as different states.
10.	Add "/d3" at end of the IP address to go to the interactive graph where tracking and stats are shown.
11.	The Folder named as Extension (Prediction). You can see Borderify.js file.
12.	Open Mozilla/Chrome or any browser and load borderify.js as a temporary extension.
13.	Now open Xamp server and start services.
14.	Then load E-commerce site on local host.'
15.	The extension will give prompts to add server IP address, Username and System Under Test (SUT) URL. Enter these fields to log In as a user into the server. 
16.	The extension will now also give predictions on the website.
17.	Perform any action on the website and the graph will update the states according to the action performed.
18.	The "hide all" button hides all the states and will only show them when an action is performed on the state.
19.	To send errors to the graph page open the "Bug Reporting" folder and on the CMD run "npm start" command. (If node modules not installed first run "npm install")
20.	This will lead to the error sending page. Fill the form to send error to the server and the graph will update the state on which the error is found by showing "Bug" text on the state.
21.	On the graph page there is the button that shows the stats and the errors found during the testing.
22.	The stats button will show the the active users and their number of clicks and explored and total nodes of the graph.
23.	The error button will show the bugs found and their details
