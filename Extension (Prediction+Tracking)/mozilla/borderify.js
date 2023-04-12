document.body.style.border = "5px solid red";
document.addEventListener("click", getClick);
var list_of_colors = ["red", "green", "orange", "blue"];

var list_of_classes = ["product",
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


var currentUrl = window.location.href;

let sessionMemory = sessionStorage.getItem("sessionVar");
let name = sessionStorage.getItem("sessionVarName");
let url = sessionStorage.getItem("sessionVarUrl");

if (
    !sessionMemory ||
    !name ||
    !url ||
    sessionMemory.toLowerCase() == "null" ||
    name.toLowerCase() == "null" ||
    url.toLowerCase() == "null"
) {
    sessionMemory = prompt("Server IP", "192.168.100.195");
    name = prompt("Enter Username", "fozan");
    url = prompt("SUT URL", "http://localhost/shopifyUser/");

    sessionStorage.setItem("sessionVar", sessionMemory);
    sessionStorage.setItem("sessionVarName", name);
    sessionStorage.setItem("sessionVarUrl", url);
} else {
    console.log("Session Memory Already Set.");
}

function removeRelativeDots(s) {
    while (true) {
        if (s[0] === "." || s[0] === "/") {
            s = s.substr(1);
        } else {
            break;
        }
    }
    return s;
}

function qualifyURL(url) {
    var img = document.createElement("img");
    img.src = url; // set string url
    url = img.src; // get qualified url
    img.src = null; // no server request
    return url;
}

//Fetching last state from Flask Server
$.ajax({
	type: "GET",
    url: "http://" + sessionMemory + ":8484/predictiondata",
	data: { testString: "none" },
	success: function (response) {
		let maxArray = [];
		let patternProb = response.probs;
		let patternClass = response.classes;
		let tempProb = patternProb;
		let tempClass = patternClass;
		let display_count = 0

		//Displaying recommendations to the tester
		for (let i = 0; display_count < 3; i++) {
			if (tempProb.length == 0) {
				break;
			}
			let maxProb = Math.max(...tempProb);
			let indexProb = tempProb.indexOf(maxProb);
			let maxClass = tempClass[indexProb];
			
			//Highlighting the elements 
			let found = highlightElement(maxClass, display_count);
			console.log(tempClass);
			if (found == 1) {
				maxArray.push(maxClass);
				display_count++;
			}
			tempProb = tempProb.filter(function (letter, index) {
				return index !== indexProb;
			});
			tempClass = tempClass.filter(function (letter, index) {
				return index !== indexProb;
			});
		}
		console.log(maxArray);

	}
});

//Handling hyperreference 
function hrefString(ok) {

	let index = ok.indexOf("href");
	var empty = ""
	let i = 0;
	var check = 0;
	while (i < ok.length) {

		if (i > index && ok[i] === '"') {
			check++;
		}
		if (check >= 2) {
			empty += ok[i];
		}
		else if (check == 0 && i < index) {
			empty += ok[i];
		}
		i++;
	}
	return empty;

}

//Highlight all clickable elements
function highlightAll() {
	A_tag = document.querySelectorAll('a');
	Btn_tag = document.querySelectorAll('button');
	Select_tag = document.querySelectorAll('select');
	Input_tag = document.querySelectorAll('input');
	I_tag = document.querySelectorAll('i');
	// span_tag=document.querySelectorAll('span');

	for (let i = 0; i < A_tag.length; i++) {
		A_tag[i].style.border = 'thick solid blue';
	}
	for (let i = 0; i < Btn_tag.length; i++) {
		Btn_tag[i].style.border = 'thick solid blue';

	}
	for (let i = 0; i < Select_tag.length; i++) {
		Select_tag[i].style.border = 'thick solid blue';

	}
	for (let i = 0; i < Input_tag.length; i++) {
		Input_tag[i].style.border = 'thick solid blue';

	}
	for (let i = 0; i < I_tag.length; i++) {
		I_tag[i].style.border = 'thick solid blue';

	}
	// for(let i=0;i<span_tag.length;i++){

	// 	var str = hrefString(span_tag[i].outerHTML.toString().toLowerCase());
	// 	if (str.includes(to_find)) {
	// 	span_tag[i].style.border = 'thick solid green';
	//		found=1;
	// 	}
	// }

}

//Probability based element highlighting
function highlightElement(to_find, color) {

	var appliedStyle = "thick solid " + list_of_colors[color];

	console.log(appliedStyle, color);

	//Highlighting all clickable elements starts
	A_tag = document.querySelectorAll('a');
	Btn_tag = document.querySelectorAll('button');
	Select_tag = document.querySelectorAll('select');
	Input_tag = document.querySelectorAll('input');
	I_tag = document.querySelectorAll('i');
	// span_tag=document.querySelectorAll('span');
	var found = 0;

	for (let i = 0; i < A_tag.length; i++) {
		var str = hrefString(A_tag[i].outerHTML.toString().toLowerCase());
		if (str.includes(to_find)) {
			A_tag[i].style.border = appliedStyle;
			found = 1;
		}

	}
	for (let i = 0; i < Btn_tag.length; i++) {
		var str = hrefString(Btn_tag[i].outerHTML.toString().toLowerCase());
		if (str.includes(to_find)) {
			Btn_tag[i].style.border = appliedStyle;
			found = 1;
		}
	}
	for (let i = 0; i < Select_tag.length; i++) {
		var str = hrefString(Select_tag[i].outerHTML.toString().toLowerCase());
		if (str.includes(to_find)) {
			Select_tag[i].style.border = appliedStyle;
			found = 1;
		}
	}
	for (let i = 0; i < Input_tag.length; i++) {
		var str = hrefString(Input_tag[i].outerHTML.toString().toLowerCase());
		if (str.includes(to_find)) {
			Input_tag[i].style.border = appliedStyle;
			found = 1;
		}
	}
	for (let i = 0; i < I_tag.length; i++) {
		var str = hrefString(I_tag[i].outerHTML.toString().toLowerCase());
		if (str.includes(to_find)) {
			I_tag[i].style.border = appliedStyle;
			found = 1;
		}
	}
	// for(let i=0;i<span_tag.length;i++){

	// 	var str = hrefString(span_tag[i].outerHTML.toString().toLowerCase());
	// 	if (str.includes(to_find)) {
	// 	span_tag[i].style.border = 'thick solid green';
	//		found=1;
	// 	}
	// }
	return found;

}
//per elem click

var clickCount = 0;
function getClick(event) {
    let elem = event.target.tagName;
    if (
        elem === "INPUT" ||
        elem === "BUTTON" ||
        elem === "A" ||
        elem === "SELECT" ||
        elem === "SPAN" ||
        elem === "I"
    ) {
        let st = get_Actions_OR_state();
        let ht = "";
        if (event.target.tagName === "A") {
            let cln = event.target.cloneNode(true);
            //cln.href = new URL(removeRelativeDots(cln.getAttribute("href")),url).toString()
            cln.href = qualifyURL(cln.getAttribute("href"));
            console.log(cln.href);
            ht = cln.outerHTML;
        } 
        else {
            ht = event.target.outerHTML;
        }
        clickCount++;
        // console.log(clickCount)
        $.ajax({
            type: "POST",
            url: "http://" + sessionMemory + ":8484/data",
            contentType: "application/json",
            data: JSON.stringify({
                key: elem + ":separator:" + ht + ":separator:" + name,
                state: st,
                clickC: clickCount,
            }),
            success: function (data, status) {},
        });
        $.ajax({
            type: "POST",
            url: "http://" + sessionMemory + ":8484/getURL",
            contentType: "application/json",
            data: JSON.stringify({ pageURL: currentUrl }),
            success: function (data, status) {},
        });

        // Prediction
        ht = "";
        if (event.target.tagName === "A") {
            let cln = event.target.cloneNode(true);
            //cln.href = qualifyURL(cln.getAttribute("href"))
            ht = cln.outerHTML;
        } else {
            // ht = event.target.outerHTML;
            ht = event.target.parentNode.outerHTML;
        }

        //Finding clicked element class
        var clicked = ht.toString().toLowerCase();
        var counts = [];
        for (let i = 0; i < list_of_classes.length; i++) {
            counts[i] = 0;
            var find = list_of_classes[i];
            var count = clicked.split(find).length - 1;
            counts[i] = count;
        }
        //Now getting max count
        var max = Math.max(...counts);
        var index = counts.indexOf(max);

        //alert(index);
        var Testing_pattern = list_of_classes[index];

        //FLASK SERVER
        if (max == 0) {
            Testing_pattern = "NULL";
        } else {
            highlightAll();
            //Sending Clicked element pattern to server
            $.ajax({
                type: "GET",
                url: "http://" + sessionMemory + ":8484/login",
                data: { testString: Testing_pattern },
                success: function (response) {
                    var maxArray = [];
                    var patternProb = response.probs;
                    var patternClass = response.classes;
                    var tempProb = patternProb;
                    var tempClass = patternClass;
                    var display_count = 0;
                    //Displaying recommendations to the tester
                    for (let i = 0; display_count < 3; i++) {
                        if (tempProb.length == 0) {
                            break;
                        }
                        var maxProb = Math.max(...tempProb);
                        var indexProb = tempProb.indexOf(maxProb);
                        var maxClass = tempClass[indexProb];
                        var found = highlightElement(maxClass, display_count);
                        console.log(tempClass);
                        if (found == 1) {
                            maxArray.push(maxClass);
                            display_count++;
                        }
                        tempProb = tempProb.filter(function (letter, index) {
                            return index !== indexProb;
                        });
                        tempClass = tempClass.filter(function (letter, index) {
                            return index !== indexProb;
                        });
                    }
                    console.log(maxArray);
                },
            });
        }

    }
}
setInterval(function () {
    //setTimeout(function(){
    $.ajax({
        type: "POST",
        url: "http://" + sessionMemory + ":8484/getURL",
        contentType: "application/json",
        data: JSON.stringify({ pageURL: currentUrl }),
        success: function (data, status) {},
    });
}, 500);

//--------------------------------------------Receiving----------------------------
function keepGetting() {
    $.get("http://" + sessionMemory + ":8484/getdata", function (data, status) {
        if (data === "ack") {
            return;
        }
        alert("Data: " + data + "\nStatus: " + status);
        //let arr = JSON.parse(data);
        arr = data.data;
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {
            console.log("test - 1");
            console.log(arr[i]);
            //Is get path static?
            getXPath(
                "/html/body/table[3]/tbody/tr[1]/td[1]/table/tbody/tr[9]/td/input"
            ); // XPath is of PHPTimeclock only
        }
    });
}
//setInterval(function(){keepGetting()},1000)

function getXPath(path) {
    var headings = document.evaluate(
        path,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
    );
    var thisHeading = headings.iterateNext();
    var alertText = "Level 2 headings in this document are:\n";
    while (thisHeading) {
        alertText += thisHeading.textContent + "\n";
        thisHeading = headings.iterateNext();
    }
    alert(alertText);
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

let tags_to_find = ["input", "button", "a", "select"];
function get_Actions_OR_state() {
    let tagstr = [];
    console.log("Entered actionState");
    for (let i = 0; i < tags_to_find.length; i++) {
        // in tags_to_find){
        let x = tags_to_find[i];

        xtags = document.getElementsByTagName(x);
        if (xtags == []) {
            continue;
        }
        for (let j = 0; j < xtags.length; j++) {
            //htmlElement in xtags){
            let htmlElement = xtags[j];
            let s = x + "!@!";
            if (x == "input") {
                if (
                    htmlElement.getAttribute("name") !== "" &&
                    htmlElement.getAttribute("name") !== null
                )
                    s += htmlElement.getAttribute("name").trim() + "!@!";
                else s += "nan!@!";

                value_attr = htmlElement.getAttribute("value");
                type_attr = htmlElement.getAttribute("type");

                if (
                    value_attr !== "" &&
                    value_attr !== null &&
                    type_attr !== "text" &&
                    type_attr !== "password"
                )
                    s += htmlElement.getAttribute("value").trim() + "!@!";
                else s += "nan!@!";
                s += "nan";
            } else if (x == "button") {
                s += "nan!@!";
                if (
                    htmlElement.getAttribute("value") !== "" &&
                    htmlElement.getAttribute("value") !== null
                )
                    s += htmlElement.getAttribute("value").trim() + "!@!";
                else s += "nan!@!";
                s += "nan";
            } else if (x == "a") {
                s += "nan!@!";
                s += "nan!@!";
                if (
                    htmlElement.getAttribute("href") !== "" &&
                    htmlElement.getAttribute("href") !== null
                ) {
                    //let qa = new URL(htmlElement.getAttribute('href').trim(),url)
                    //console.log(qa.toString())
                    //s+= qa.toString()

                    s += htmlElement.getAttribute("href").trim();
                } else {
                    s += "nan";
                }
            } else if (x == "select") {
                if (
                    htmlElement.getAttribute("name") !== "" &&
                    htmlElement.getAttribute("name") !== null
                )
                    s += htmlElement.getAttribute("name").trim() + "!@!";
                else s += "nan!@!";
                s += "nan!@!";
                s += "nan";
            }
            tagstr.push(s);
            //console.log(tagstr);
            //console.log(typeof (tagstr));
        }
        //console.log("all done ");
    }
    //		console.log(tagstr[4]);
    //		console.log(tagstr[4].toString());

    //check if a tag
    //if yes, append hash '#'
    for (let i = 0; i < tagstr.length; i++) {
        x = tagstr[i].split("!@!");
        if (x[0] == "a") x[x.length - 1] = "#";
        x = x.join("!@!");
        //console.log(x)
        //console.log(typeof (x))

        //			x = "!@!" + x
        tagstr[i] = x;
    }
    return tagstr.join("\n"); // + (tagstr)
}

//Added click counter here.....
