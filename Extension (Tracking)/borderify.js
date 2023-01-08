//What to find in a webpage
var to_find = "continue";

//Getting Data from Node Server
$.ajax({
	type: "GET",
	url: "http://localhost:3000/val",
	success: function (response) {
		to_find = response;
	}
});

//Start Session
let btn = document.createElement("button");
btn.innerHTML = "Start Session";
btn.id = "startsess"
btn.type = "submit";
btn.name = "formBtn";
document.body.appendChild(btn);
document.getElementById("startsess").style = "position:absolute";

var state = "random";
document.getElementById("startsess").addEventListener("click", function () {
	state = "start";
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/session",
		data: JSON.stringify({
			state
		}),
		success: function (response) {
			console.log(response);
		}
	});
});

//End Session
let btn1 = document.createElement("button");
btn1.innerHTML = "End Session";
btn1.id = "endsess"
btn1.type = "submit";
btn1.name = "formBtn";
document.body.appendChild(btn1);
document.getElementById("endsess").style = "position:relative";
document.getElementById("endsess").style = "margin-top:50px";

document.getElementById("endsess").addEventListener("click", function () {
	state = "end";
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/session",
		data: JSON.stringify({
			state
		}),
		success: function (response) {
			console.log(response);
		}
	});
});



// List of classes
var list_of_classes = ["search", "cart", "signin", 
	"login","register", "account", "help", "orders",
	"sell", "categories", "language", "android",
	"app store", "share", "contact s", "filter",
	"checkout", "buy", "-sale", "deal", "visit",
	"ship", "watch list", "wish list", "-next",
	"-previous", "more", "shop", "feedback", "store",
	"top", "quantity", "report", "popular", "-logo",
	"notification", "details"
];



document.body.style.border = "5px solid red";
document.addEventListener("click", getClick);
document.addEventListener('click', (event) => {

	//Highlighting all clickable elements starts
	A_tag = document.querySelectorAll('a');
	Btn_tag = document.querySelectorAll('button');
	Select_tag = document.querySelectorAll('select');
	Input_tag = document.querySelectorAll('input');
	I_tag = document.querySelectorAll('i');
	// span_tag=document.querySelectorAll('span');

	//var to_find = "search";
	for (let i = 0; i < A_tag.length; i++) {
		var str = A_tag[i].outerHTML.toString().toLowerCase();
		if (str.includes(to_find)) {
			A_tag[i].style.border = 'thick solid green';
		} else {
			A_tag[i].style.border = 'thick solid blue';
		}
	}
	for (let i = 0; i < Btn_tag.length; i++) {
		var str = Btn_tag[i].outerHTML.toString().toLowerCase();
		if (str.includes(to_find)) {
			Btn_tag[i].style.border = 'thick solid green';
		} else {
			Btn_tag[i].style.border = 'thick solid blue';
		}
	}
	for (let i = 0; i < Select_tag.length; i++) {
		var str = Select_tag[i].outerHTML.toString().toLowerCase();
		if (str.includes(to_find)) {
			Select_tag[i].style.border = 'thick solid green';
		} else {
			Select_tag[i].style.border = 'thick solid blue';
		}
	}
	for (let i = 0; i < Input_tag.length; i++) {
		var str = Input_tag[i].outerHTML.toString().toLowerCase();
		if (str.includes(to_find)) {
			Input_tag[i].style.border = 'thick solid green';
		} else {
			Input_tag[i].style.border = 'thick solid blue';
		}
	}
	for (let i = 0; i < I_tag.length; i++) {
		var str = I_tag[i].outerHTML.toString().toLowerCase();
		if (str.includes(to_find)) {
			I_tag[i].style.border = 'thick solid green';
		} else {
			I_tag[i].style.border = 'thick solid blue';
		}
	}
	// for(let i=0;i<span_tag.length;i++){

	// 	var str = span_tag[i].outerHTML.toString().toLowerCase();
	// 	if (str.includes(to_find)) {
	// 	span_tag[i].style.border = 'thick solid green';
	// 	}
	// 	else{
	// 	span_tag[i].style.border = 'thick solid blue';
	// 	}
	// }

})

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
			//alert(ht);
		}

		

		//Based on click find the count 
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

		if (max == 0) {
			
		} else {
			
			if (state != "start" && state != "end") {
				$.ajax({
					type: "POST",
					url: "http://localhost:3000/",
					data: JSON.stringify({
						Testing_pattern
					}),
					success: function (response) {
						console.log(response);
					}
				});
			}
			state = "random";

		}
	}
}