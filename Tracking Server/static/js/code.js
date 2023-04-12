let graphNodes=[];
let graphLinks =[];
let mappedLinks =[];
//mapping//line label//onclick listener
function gg(){
    console.log(" GG Called");

}
gg()
let style = cytoscape.stylesheet()
    .selector('node')
      .css({
		'shape':"circle",
        'height': 20,
        'width': 20,
        'background-fit': 'cover',
        'border-color': '#000',
        'border-width': 2,
        'border-opacity': 0.5,
		 "label": "data(label)",
		 'color':'red'
      })
    .selector('.eating')
      .css({
        'border-color': 'red'
      })
    .selector('.eater')
      .css({
        'border-width': 7
      })
    .selector('edge')
      .css({
		'line-cap' : 'butt',
        //'curve-style': 'unbundled-bezier',
		'curve-style': 'bezier',
		'control-point-step-size' :'10',
		'loop-sweep': '150',
        'width': 0.1,
        'target-arrow-shape': 'triangle',
        'arrow-scale':'0.5',
        'line-color': '#000',
        'target-arrow-color': '#f00',
		"label": "data(linkName)",
		"font-size": "5px",
		"edge-text-rotation": "autorotate"

	});
for(let i=0;i<data.length;i++){
         let imgUrl = "";
         jQuery.ajax({
            url: "/get_image?name=" + data[i].src+".png",
            success: function (result) {
                imgUrl = result.data
            },
            async: false
        });
	style = style.selector('#' + data[i].src)

      style.css({
       'background-image': 'url("data:image/png;base64,'+imgUrl+'")',
    });
    //console.log("Here!@!!!!");
	graphNodes.push({
		data:{id:data[i].src}
	});
	if(data[i].start == 1){
		graphNodes[graphNodes.length-1].data["label"] = "Root"
		console.log(graphNodes[graphNodes.length-1].data["src"])
	}
	for(let j =0;j<data[i].edges.length;j++){
	   //self loop condition
	    if(data[i].src && data[i].edges[j].state && data[i].src!=data[i].edges[j].state){
       //  if(data[i].src && data[i].edges[j].state){
			graphLinks.push({
				data:{
					target:data[i].edges[j].state,
					source:data[i].src,
					label:data[i].edges[j].action,
					linkName: getActionName(data[i].edges[j].action),
					action: data[i].edges[j].action
				}
			});
		}
	}
}
for(let i=0;i<graphLinks.length;i++){
	let checkNotExist = true;
	for(let j=0;j<graphNodes.length;j++){
		if(graphNodes[j].data.id === graphLinks[i].data.target){
			checkNotExist = false;
			break;
		}
	}
	if(checkNotExist){
		graphLinks.splice(i,1);
	}
}

//let options = {
//  name: 'grid',
//
//  fit: true, // whether to fit the viewport to the graph
//  padding: 10, // padding used on fit
//  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//  avoidOverlapPadding: 20, // extra spacing around nodes when avoidOverlap: true
//  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
//  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
//  condense: true, // uses all available space on false, uses minimal space on true
//  rows: undefined, // force num of rows in the grid
//  cols: undefined, // force num of columns in the grid
//  position: function( node ){}, // returns { row, col } for element
//  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
//  animate: true, // whether to transition the node positions
//  animationDuration: 500, // duration of animation in ms if enabled
//  animationEasing: undefined, // easing of animation if enabled
//  animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
//  ready: undefined, // callback on layoutready
//  stop: undefined, // callback on layoutstop
//  transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
//};

let options = {
  name: 'breadthfirst',

  fit: true, // whether to fit the viewport to the graph
  directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
  padding: 30, // padding on fit
  circle: false, // put depths in concentric circles if true, put depths top down if false
  grid: true, // whether to create an even grid into which the DAG is placed (circle:false only)
  spacingFactor: 1, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  roots: undefined, // the roots of the trees
  maximal: true, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled,
  animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
};





var cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: style,

  elements: {
    nodes: graphNodes,
    edges: graphLinks
  },
  layout: options
  //layout: {
  //  name: 'cose',
  //  directed: true,
  //  padding: 10
 // }
});
// cy init
function highlightEdge(edge,node,color,actualAction){
    //console.log("----------------------------------------------------------------highlight------------------------------------------------------");
    //console.log(edge,node,actualAction)
    console.log("Yay edge:"+edge);
	//cy.filter(function(element, i){
    //  return !element.isNode() && element.data('label') == 50 && element.data('source') == node;
    //}).style({'color': color,'line-color':color,"target-arrow-color":color});
	cy.edges('[label = "'+edge+'"][source = "'+node+'"]').style({'color': color,'line-color':color,"target-arrow-color":color});
    cy.getElementById(node).style({
        'border-color': color,
        'border-width': 5,
        'border-opacity': 1,});
	//graphNodesdata:{id:data[i].src}

}
function callGetData(){
    jQuery.ajax({
        url: "/getdata",
        success: function (result) {
            let arr = result
            //console.log(arr);
            if(arr && arr.id!=="ack"){
                arr = arr.data;
                findAndUpdate(arr);
            }
           // callGetData();
        },
        error:function(xhr,status){
         //   callGetData()
        }
//        async: false
    });

}
setInterval(function(){
//setTimeout(function(){
    callGetData();
    },3000)
//},1000)
//for(let i=0;i<graphLinks.length;i++){
//    console.log(graphLinks[i].data.action);
////    if()
//}
//function highlightEdge(edge,node,color,actualAction){
function findAndUpdate(arr){
    if(!arr){return;}
    for(let i=0;i<arr.length;i++){
        //arr[i].data properties = action,state,color
        for(let j=0;j<graphLinks.length;j++){
            if(arr[i].state === graphLinks[j].data.source){
                //console.log("Found Source Edge");
                let found = false;
                console.log("State: "+arr[i].state," links");
                //console.log("Finding edges linked to source");
                for(let k=0;k<graphLinks.length;k++){
                    if((arr[i].action === graphLinks[k].data.action)  && (graphLinks[k].data.source === arr[i].state)){
                            console.log("in source:"+graphLinks[j].data.source);
                        highlightEdge(graphLinks[k].data.label,graphLinks[k].data.source,arr[i].color,graphLinks[k].data.action)
                        //found = true;
                        break;
                    }
                }
                //if(found){break;}
            }
        }

        //target:data[i].edges[j].state,
        //source:data[i].src,
        //label:data[i].edges[j].action,
        //linkName: getActionName(data[i].edges[j].action),
        //highlightEdge(graphLinks[0].data.linkName)
    }

}

//function findAndUpdate(arr){
//    if(!arr){return;}
//    for(let i=0;i<arr.length;i++){
//        //arr[i].data properties = action,state,color
//        for(let j=0;j<graphLinks.length;j++){
//            if(arr[i].state === graphLinks[j].data.source){
//           console.log(arr[i].state);
//                //console.log("Found Source Edge");
//
//                console.log("Yooo")
//                let found = false;
//                let skipped = false;
//                //console.log(arr[i].state);
//                //console.log("Finding edges linked to source");
//                let highlightInfo = []
//                for(let k=0;k<graphLinks.length;k++){
//
//                    if(arr[i].action === graphLinks[k].data.action){
//                        //if(skipped){
//                            console.log(graphLinks[j].data.source);
//                            highlightInfo.push([graphLinks[k].data.label,graphLinks[k].data.source,arr[i].color,graphLinks[k].data.action]);
//                            //highlightEdge(graphLinks[k].data.label,graphLinks[k].data.source,arr[i].color,graphLinks[k].data.action)
//                            //found = true;
//                            //break;
//                        //}
//                        //else{
//                            //skipped = true;
//                        //}
//                    }
//                }
//                if(highlightInfo.length>0){
//                    thisIndex = highlightInfo.length-1
//                    highlightEdge(highlightInfo[thisIndex][0],highlightInfo[thisIndex][1],highlightInfo[thisIndex][2],highlightInfo[thisIndex][3])
//                }
//
//                //if(found){break;}
//            }
//        }
//
//        //target:data[i].edges[j].state,
//        //source:data[i].src,
//        //label:data[i].edges[j].action,
//        //linkName: getActionName(data[i].edges[j].action),
//        //highlightEdge(graphLinks[0].data.linkName)
//    }
//
//}

let selectedNode = null;
cy.on('tap', 'node', function(){
  if(selectedNode){
	selectedNode.removeClass("eater");
  }
  console.log("Tapped")
  var nodes = this;
  selectedNode = nodes;
  nodes.addClass('eater');
  let id = nodes[0].json().data.id;

    let imgUrl = "";
     jQuery.ajax({
        url: "/get_image?name=" + id + ".png",
        success: function (result) {
            imgUrl = result.data
        },
        async: false
    });

    document.getElementById("myImg").src = "data:image/png;base64,"+imgUrl;
    document.getElementById("myNav").style.width = "100%";
  //fetch("./../data/Q_Result/"+id + '.html')
  //.then(response => response.text())
  //.then(text => document.getElementById("data").innerHTML = safe_tags(text));
    jQuery.ajax({
        url: "/get_File?name=" + id + ".html",
        success: function (result) {
            imgUrl = result.data
        },
        async: false
    });
    document.getElementById("data").innerHTML = safe_tags(imgUrl)
}); // on tap


function safe_tags(str) {
    let ret = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;<br/>') ;
    console.log(ret)
    return ret
}

function getActionName(action){
	for(let i=0;i<mappedLinks.length;i++){
		if(action === mappedLinks[i].id){
			return mappedLinks[i].name
		}
	}
	mappedLinks.push({
		id:action,
		name:"Action " + (mappedLinks.length+1),
	});
	return mappedLinks[mappedLinks.length-1].name;
}
function checkRequestAck(){
	$.get( "/", function(data) {
		if(data === "ack"){
			console.log(data)
			checkRequestAck();
		}
		else{
			console.log(data);
			checkRequestAck();
		}
	});
}
//checkRequestAck()





//[{
//    "action": "select!@!left_fullname!@!nan!@!nan",
//    "color": "#4026ff",
//    "id": "Bhoosriwala",
//    "state": "2a37943c3d7117b3f16609f866c1e35f"
//}, {
//    "action": "select!@!left_fullname!@!nan!@!nan",
//    "color": "#4026ff",
//    "id": "abc",
//    "state": "2a37943c3d7117b3f16609f866c1e35f"
//}, {
//    "action": "select!@!left_fullname!@!nan!@!nan",
//    "color": "#4026ff",
//    "id": "ddd",
//    "state": "2a37943c3d7117b3f16609f866c1e35f"
//}, {
//    "action": "select!@!left_inout!@!nan!@!nan",
//    "color": "#4A3DAA",
//    "id": "abc",
//    "state": "2a37943c3d7117b3f16609f866c1e35f"
//}, {
//    "action": "input!@!employee_passwd!@!nan!@!nan",
//    "color": "#A5ADC4",
//    "id": "ddd",
//    "state": "2a37943c3d7117b3f16609f866c1e35f"
//}]