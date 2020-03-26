// /* eslint-disable no-param-reassign */
// import * as d3 from 'd3';

// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }

// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }

// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
// }



// export default function startGraph(data) {
//   const svg = d3.select('svg');
//   const width = +svg.attr('width');
//   const height = +svg.attr('height');

//   // const color = d3.scaleOrdinal(d3.schemeCategory20);

//   const simulation = d3.forceSimulation()
//     .force('link', d3.forceLink().id((d) => d.id))
//     .force('charge', d3.forceManyBody())
//     .force('center', d3.forceCenter(width / 2, height / 2));

//   // const jsonobj = JSON.stringify({})
//   d3.json(data, (error, graph) => {
//     if (error) throw error;

//     const link = svg.append('g')
//       .attr('class', 'links')
//       .selectAll('line')
//       .data(graph.links)
//       .enter()
//       .append('line')
//       .attr('stroke-width', (d) => Math.sqrt(d.value));

//     const node = svg.append('g')
//       .attr('class', 'nodes')
//       .selectAll('g')
//       .data(graph.nodes)
//       .enter()
//       .append('g');

//     const circles = node.append('circle')
//       .attr('r', 5)
//       // .attr('fill', (d) => color(d.group))
//       .call(d3.drag()
//         .on('start', dragstarted)
//         .on('drag', dragged)
//         .on('end', dragended));

//     const lables = node.append('text')
//       .text((d) => d.id)
//       .attr('x', 6)
//       .attr('y', 3);

//     node.append('title')
//       .text((d) => d.id);


//     function ticked() {
//       link
//         .attr('x1', (d) => d.source.x)
//         .attr('y1', (d) => d.source.y)
//         .attr('x2', (d) => d.target.x)
//         .attr('y2', (d) => d.target.y);

//       node
//         .attr('transform', (d) => `translate(${d.x},${d.y})`);
//     }

//     simulation
//       .nodes(graph.nodes)
//       .on('tick', ticked);

//     simulation.force('link')
//       .links(graph.links);

//   });




// }
