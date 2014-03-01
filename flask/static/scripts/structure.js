
var data = [4, 8, 15, 16, 23, 42];
var wordsense = {'hyponyms': [{'name': 'bracket.n.04'}, {'name': 'bearing_wall.n.01'}, {'name': 'rack.n.05'}, {'name': 'foot.n.11'}, {'name': 'harp.n.02'}, {'name': 'back.n.08'}, {'name': 'bridge.n.06'}, {'name': 'stock.n.03'}, {'name': 'stirrup.n.01'}, {'name': 'tee.n.02'}, {'name': 'tailstock.n.01'}, {'name': 'bar.n.13'}, {'name': 'base.n.08'}, {'name': 'yoke.n.05'}, {'name': 'bearing.n.06'}, {'name': 'arch_support.n.01'}, {'name': 'pier.n.02'}, {'name': 'pier.n.03'}, {'name': 'spoke.n.01'}, {'name': 'foothold.n.02'}, {'name': 'harness.n.01'}, {'name': 'leg.n.03'}, {'name': 'pillow_block.n.01'}, {'name': 'andiron.n.01'}, {'name': 'undercarriage.n.01'}, {'name': 'bedpost.n.01'}, {'name': 'hanger.n.02'}, {'name': 'baluster.n.01'}, {'name': 'rib.n.01'}, {'name': 'step.n.04'}, {'name': 'rest.n.06'}, {'name': 'structural_member.n.01'}, {'name': 'bookend.n.01'}, {'name': 'headstock.n.01'}, {'name': 'backboard.n.02'}, {'name': 'brace.n.01'}, {'name': 'shelf.n.01'}, {'name': 'seat.n.04'}, {'name': 'rocker.n.07'}, {'name': 'handrest.n.01'}, {'name': 'perch.n.01'}], 'name': 'support'}
var treeData = {
    name: "/",
    contents: [
        {
            name: "Applications",
            contents: [
                { name: "Mail.app" },
                { name: "iPhoto.app" },
                { name: "Keynote.app" },
                { name: "iTunes.app" },
                { name: "XCode.app" },
                { name: "Numbers.app" },
                { name: "Pages.app" }
            ]
        },
        {
            name: "System",
            contents: []
        },
        {
            name: "Library",
            contents: [
                {
                    name: "Application Support",
                    contents: [
                        { name: "Adobe" },
                        { name: "Apple" },
                        { name: "Google" },
                        { name: "Microsoft" }
                    ]
                },
                {
                    name: "Languages",
                    contents: [
                        { name: "Ruby" },
                        { name: "Python" },
                        { name: "Javascript" },
                        { name: "C#" }
                    ]
                },
                {
                    name: "Developer",
                    contents: [
                        { name: "4.2" },
                        { name: "4.3" },
                        { name: "5.0" },
                        { name: "Documentation" }
                    ]
                }
            ]
        },
        {
            name: "opt",
            contents: []
        },
        {
            name: "Users",
            contents: [
                { name: "pavanpodila" },
                { name: "admin" },
                { name: "test-user" }
            ]
        }
    ]
};

var size = { width:1200 , height:800 };
var options = { fontSize:18, nodeRadius:3};
var maxLabelLength = 20;

var tree = d3.layout.tree()
    .sort(null)
    .size([size.height, size.width - maxLabelLength*options.fontSize])
    .children(function(d)
    {
        return (!d.hyponyms || d.hyponyms.length === 0) ? null : d.hyponyms;
    });

// var nodes = tree.nodes(wordsense);
// var links = tree.links(nodes);

var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 800 - m[0] - m[2],
    i = 0,
    root;

$(document).ready(function() { 


	// update( wordsense );
	// initTree();
	$.urlParam = function(name){
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (!results) { return 0; }
		return results[1] || 0;
	}

	var query = $.urlParam( 'query' );

	$.getJSON('/api/word/'+ query , function(data){
		
		
		wordsense = data['contents'][0];
		wordsense.name = data['contents'][0]['sense'];
		
		initTree();
		

	}).error(function(err){				
		console.log( err );
	});


	

 }) 

function initTree( ){
	var layoutRoot = d3.select("body")
	     .append("svg:svg").attr("width", size.width).attr("height", size.height)
	     .append("svg:g")
	     .attr("class", "container")
	     .attr("transform", "translate(" + maxLabelLength + ",0)");

	 var diagonal = d3.svg.diagonal()
	     .projection(function(d)
	     {
	         return [d.y, d.x];
	     });

	 // Edges between nodes as a <path class="link" />

	 // layoutRoot.selectAll("path.link")
	 //     .data(links)
	 //     .enter()
	 //     .append("svg:path")
	 //     .attr("class", "link")
	 //     .attr("d", diagonal);


	 /*
	     Nodes as
	     <g class="node">
	         <circle class="node-dot" />
	         <text />
	     </g>
	  */
	 // var nodeGroup = layoutRoot.selectAll("g.node")
	 //     .data(nodes)
	 //     .enter()
	 //     .append("svg:g")
	 //     .attr("class", "node")
	 //     .attr("transform", function(d)
	 //     {
	 //         return "translate(" + d.y + "," + d.x + ")";
	 //     });

	 // nodeGroup.append("svg:circle")
	 //     .attr("class", "node-dot")
	 //     .attr("r", options.nodeRadius);

	 // nodeGroup.append("svg:text")
	 //     .attr("text-anchor", function(d)
	 //     {
	 //         return d.children ? "end" : "start";
	 //     })
	 //     .attr("dx", function(d)
	 //     {
	 //         var gap = 2 * options.nodeRadius;
	 //         return d.children ? -gap : gap;
	 //     })
	 //     .attr("dy", 3)
	 //     .text(function(d)
	 //     {
	 //         return d.name;
	 //     });

	wordsense.x0 = 200;
	wordsense.y0 = 0;
	
	toggle( wordsense , function(){ update( wordsense, layoutRoot, diagonal );} );
	toggle( wordsense , function(){ update( wordsense, layoutRoot, diagonal );} );
	

}


function toggle(d, callback) {

	if (d.hyponyms) {
		d._hyponyms = d.hyponyms;
		d.hyponyms = null;
		callback();
	} else {
		$.getJSON('/api/sense/'+ d.sense + '/hyponym' , function(data){

			
			d.hyponyms = data.hyponyms;
			d._hyponyms = null;
			

			callback();

		}).error(function(err){				
			console.log( err );
		});
			// d.hyponyms = d._hyponyms;
			// d._hyponyms = null;
			// callback();
		
		
	}

}

function update(source, layoutRoot, diagonal) {
	var duration = d3.event && d3.event.altKey ? 5000 : 500;

	// Compute the new tree layout.
	var nodes = tree.nodes(wordsense).reverse();

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 180; });

	// Update the nodes…
	var node = layoutRoot.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", function(d) { toggle(d, function(){ update(d, layoutRoot, diagonal ) } ); });

	nodeEnter.append("svg:circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._hyponyms ? "lightsteelblue" : "#fff"; } );

	nodeEnter.append("svg:text")
	  .attr("x", function(d) { return d.hyponyms || d._hyponyms ? -10 : 10; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.hyponyms || d._hyponyms ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	nodeUpdate.select("circle")
	  .attr("r", 4.5)
	  .style("fill", function(d) { if( d._hyponyms == null){ return "#fff"; } return d._hyponyms.length!=0 ? "lightsteelblue" : "#fff"; });

	nodeUpdate.select("text")
	  .style("fill-opacity", 1);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

	nodeExit.select("circle")
	  .attr("r", 1e-6);

	nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

	// Update the links…
	var link = layoutRoot.selectAll("path.link")
	  .data(tree.links(nodes), function(d) { return d.target.id; });

	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
	    var o = {x: source.x0, y: source.y0};
	    return diagonal({source: o, target: o});
	  })
	.transition()
	  .duration(duration)
	  .attr("d", diagonal);

	// Transition links to their new position.
	link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
	    var o = {x: source.x, y: source.y};
	    return diagonal({source: o, target: o});
	  })
	  .remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
	});
}



