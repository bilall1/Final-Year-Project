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


	//Maintaing record for tester in Session Memory
	let sessionMemory = sessionStorage.getItem("sessionVar");
	let name = sessionStorage.getItem("sessionVarName");
	let url = sessionStorage.getItem("sessionVarUrl");
	
	if(!sessionMemory || !name || !url || sessionMemory.toLowerCase()=="null" || name.toLowerCase() == "null" || url.toLowerCase() == "null" ){
		sessionMemory = prompt("Server IP","xxx.xxx.xxx.xxx");
		name = prompt("Enter Username","");
		url = prompt("SUT URL","http://localhost/timeclock/");
		
		sessionStorage.setItem("sessionVar", sessionMemory);
		sessionStorage.setItem("sessionVarName", name);
		sessionStorage.setItem("sessionVarUrl", url);
	}
	else{
			console.log("not doing");
	}

//Fetching last state from Flask Server
$.ajax({
	type: "GET",
	url: "http://localhost:5000/data",
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


// List of classes
// var list_of_classes = ["search", "cart", "signin", 
// 	"login","register", "account", "help", "orders",
// 	"sell", "categories", "language", "android",
// 	"app store", "share", "contact s", "filter",
// 	"checkout", "buy", "-sale", "deal", "visit",
// 	"ship", "watch list", "wish list", "-next",
// 	"-previous", "more", "shop", "feedback", "store",
// 	"top", "quantity", "report", "popular", "-logo",
// 	"notification", "details"
// ];

// var list_of_classes = ["search", "cart","add","category",
// 					   "product","checkout","place","history",
// 					   "sort","ratings","filter","department",
// 					   "delete","quantity","shopping","signin","login",
// 					   "register","sell","help","share","deal","ship",
// 					   "feedback","report","popular","notification","details"
// 					  ];

// var list_of_classes = ["add", "cart", "category", "search",
// 	"product", "checkout", "place", "history",
// 	"sort", "ratings", "filter", "department",
// 	"delete", "quantity", "shopping"
// ];

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
document.body.style.border = "5px solid red";
document.addEventListener("click", getClick);

//Recording Pattern
function getClick(event) {


	let elem = event.target.tagName;
	if (elem === "INPUT" || elem === "BUTTON" || elem === "A" || elem === "SELECT" || elem === "SPAN" || elem === "I") {

		let ht = ""
		if (event.target.tagName === "A") {

			let cln = event.target.cloneNode(true)
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
		}
		else {
			highlightAll();
			//Sending Clicked element pattern to server
			$.ajax({
				type: "GET",
				url: "http://localhost:5000/login",
				data: { testString: Testing_pattern },
				success: function (response) {
					var maxArray = [];
					var patternProb = response.probs;
					var patternClass = response.classes;
					var tempProb = patternProb;
					var tempClass = patternClass;
					var display_count = 0
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

				}
			});
		}
	}
}
