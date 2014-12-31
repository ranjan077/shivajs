/* @license
shiva.js v0.1.0
Copyright 2015 Shivajs team
MIT Licence
*/
(function () {
	// ... all vars and functions are in this scope only
	var Shiva;
	Shiva = window.Shiva = {};

	// still maintains access to all globals
	Shiva.Chord = (function() {
		var matrix, 
		container, 
		color = ['#c7b570','#c6cdc7','#335c64','#768935','#507282','#5c4a56','#aa7455','#574109','#837722','#73342d','#0a5564','#9c8f57','#7895a4','#4a5456','#b0a690','#0a3542'];
	  	return function(options){
	  		matrix = options.matrix;
	  		container = options.container;
	  		color = options.color || color;
	  		var chord = d3.layout.chord()
			    .padding(.05)
			    .sortSubgroups(d3.descending)
			    .matrix(matrix);

			var width = 960,
			    height = 500,
			    innerRadius = Math.min(width, height) * .41,
			    outerRadius = innerRadius * 1.1;

			var fill = d3.scale.ordinal()
			    .domain(d3.range(4))
			    .range(color);

			var svg = d3.select(document.getElementById(container)).append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			svg.append("g").selectAll("path")
			    .data(chord.groups)
			  .enter().append("path")
			    .style("fill", function(d) { return fill(d.index); })
			    .style("stroke", function(d) { return fill(d.index); })
			    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

			var ticks = svg.append("g").selectAll("g")
			    .data(chord.groups)
			  .enter().append("g").selectAll("g")
			    .data(groupTicks)
			  .enter().append("g")
			    .attr("transform", function(d) {
			      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
			          + "translate(" + outerRadius + ",0)";
			    });

			ticks.append("line")
			    .attr("x1", 1)
			    .attr("y1", 0)
			    .attr("x2", 5)
			    .attr("y2", 0)
			    .style("stroke", "#000");

			ticks.append("text")
			    .attr("x", 8)
			    .attr("dy", ".35em")
			    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
			    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
			    .text(function(d) { return d.label; });

			svg.append("g")
			    .attr("class", "chord")
			  .selectAll("path")
			    .data(chord.chords)
			  .enter().append("path")
			    .attr("d", d3.svg.chord().radius(innerRadius))
			    .style("fill", function(d) { return fill(d.target.index); })
			    .style("opacity", 1);
	    }

	    // Returns an array of tick angles and labels, given a group.
		function groupTicks(d) {
		  var k = (d.endAngle - d.startAngle) / d.value;
		  return d3.range(0, d.value, 1000).map(function(v, i) {
		    return {
		      angle: v * k + d.startAngle,
		      label: i % 5 ? null : v / 1000 + "k"
		    };
		  });
		}

	})();

}());