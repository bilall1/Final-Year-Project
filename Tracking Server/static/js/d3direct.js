
// 
var links = [
    {source: "Page1", target: "Page19", type: "licensing"},
    {source: "Page1", target: "Page5", type: "licensing"},
    {source: "Page2", target: "Page8", type: "resolved"},
    {source: "Page3", target: "Page8", type: "resolved"},
    {source: "Page4", target: "Page8", type: "resolved"},
    {source: "Page5", target: "Page8", type: "resolved"},
    {source: "Page6", target: "Page8", type: "resolved"},
    {source: "Page1", target: "Page14", type: "resolved"},
    {source: "Page1", target: "Page15", type: "resolved"},
    {source: "Page7", target: "Page16", type: "resolved"},
    {source: "Page8", target: "Page5", type: "resolved"},
    {source: "Page1", target: "Page17", type: "resolved"},
    {source: "Page2", target: "Page6", type: "resolved"},
    {source: "Page9", target: "Page6", type: "resolved"},
    {source: "Page19", target: "Page6", type: "resolved"},
    {source: "Page11", target: "Page9", type: "resolved"},
    {source: "Page6", target: "Page9", type: "resolved"},
    {source: "Page8", target: "Page4", type: "resolved"},
    {source: "Page10", target: "Page4", type: "resolved"},
    {source: "Page8", target: "Page3", type: "resolved"},
    {source: "Page1", target: "Page3", type: "resolved"},
    {source: "Page3", target: "Page1", type: "resolved"},
    {source: "Page12", target: "Page18", type: "resolved"},
    {source: "Page13", target: "Page18", type: "resolved"},
    {source: "Page6", target: "Page2", type: "resolved"},
    {source: "Page8", target: "Page2", type: "resolved"},
    {source: "Page6", target: "Page19", type: "resolved"},
    {source: "Page4", target: "Page10", type: "resolved"}
  ];
  
  var nodes = {};
  
  // Compute the distinct nodes from the links.
  links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
  });

  // add images to nodes
  // nodes.forEach(function(node){
  //   // Append images
  //   var images = node.append("svg:image")
  //         .attr("xlink:href",  function(d) { console.log(d); return d.img;})
  //         .attr("x", function(d) { return -25;})
  //         .attr("y", function(d) { return -25;})
  //         .attr("height", 50)
  //         .attr("width", 50);
  // });
  let thisNodes={}
  Object.entries(nodes).forEach((node) => {
   //console.log(key+":"+JSON.stringify(value)); // "a 5", "b 7", "c 9"
    // nodeimg = "hhhhhh";
    // thisNodes[node] = node
    node[1].img = "asdsad"
    console.log(node[1])
  });
  
    let thisData = "";
  let images = []
  for(let i=0;i<data.length;i++){
    
    jQuery.ajax({
       url: "/get_image?name=" + data[i].src+".png",
       success: function (result) {
           images.push(result.data)
       },
       async: false
   });
}
console.log(images)


  var width = 960,
      height = 500;
  console.log(nodes)
  
  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(100)
      .charge(-320)
      .on("tick", tick)
      .start();
  
  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);
  //let node =  svg.selectAll(".node")
  // var images = node.append("svg:image")
  //     .attr("xlink:href",  function(d) {  return d.img;})
  //     .attr("x", function(d) { return -25;})
  //     .attr("y", function(d) { return -25;})
  //     .attr("height", 100)
  //     .attr("width", 100);
  // Per-type markers, as they don't inherit styles.
  svg.append("defs").selectAll("marker")
      .data(["suit", "licensing", "resolved"])
    .enter().append("marker")
      .attr("id", function(d) { return d; })
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5");
  
  var path = svg.append("g").selectAll("path")
      .data(force.links())
    .enter().append("path")
      .attr("class", function(d) { return "link " + d.type; })
      .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
  
  var circle = svg.append("g").selectAll("circle")
      .data(force.nodes())
    .enter().append("circle")
      .attr("r", 6)
      .call(force.drag);
  
  var text = svg.append("g").selectAll("text")
      .data(force.nodes())
    .enter().append("text")
      .attr("x", 8)
      .attr("y", ".31em")
      .text(function(d) { return d.name; });
  
  // Use elliptical arc path segments to doubly-encode directionality.
  function tick() {
    path.attr("d", linkArc);
    circle.attr("transform", transform);
    text.attr("transform", transform);
  }
  
  function linkArc(dede) {
    var dx = dede.target.x - dede.source.x,
        dy = dede.target.y - dede.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + dede.source.x + "," + dede.source.y + "A" + dr + "," + dr + " 0 0,1 " + dede.target.x + "," + dede.target.y;
  }
  
  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

