Array.prototype.pairs = function (func) {
 for (var i = 0; i < this.length - 1; i++) {
     for (var j = i; j < this.length - 1; j++) {
         func([this[i], this[j+1]]);
     }
 }
}

Array.prototype.triplets = function (func) {
 for (var i = 0; i < this.length - 2; i++) {
    for (var j = i; j < this.length - 2; j++) {
     for (var k = j; k < this.length - 2; k++) {
        func([this[i], this[j + 1], this[k + 2]]);
      }
    }
 }
}

function addQuotesIfSpace(s) {
 if ( s.indexOf(' ') >= 0 ) {
   return '"' + s + '"'
 } else {
   return s;
 }
}

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};


var svg = d3.select('#guardian_wrapper')
  .append('svg')
  .attr({'width':1200,'height':800});

var emojis = [
  /* full list - repeated at end to weight */
  {name: "happy", image:"😃"},
  {name: "cool", image:"😎"},
  {name: "love", image:"😘"},
  {name: "shocked", image:"😱"},
  {name: "anger", image:"😡"},
  {name: "sick", image:"🤢"},
  {name: "rich", image:"🤑"},
  {name: "innocent", image:"😇"},
  /* once in a lifetime jokes */
  {name: "alien", image:"👽"},
  {name: "poo", image:"💩"},
  /* for weighting only */
  {name: "happy", image:"😃"},
  {name: "cool", image:"😎"},
  {name: "love", image:"😘"},
  {name: "shocked", image:"😱"},
  {name: "anger", image:"😡"},
  {name: "innocent", image:"😇"},
  {name: "happy", image:"😃"},
  {name: "cool", image:"😎"},
  {name: "love", image:"😘"},
  {name: "shocked", image:"😱"},
  {name: "anger", image:"😡"},
  {name: "innocent", image:"😇"},
]

var entities = [
  /* full list - repeated at end to weight */
  {name: "Kim Jong-un", image:"images/kim.png"},
  {name: "Trump", image:"images/trump.png"},
  {name: "Steve Jobs", image:"images/steve.png"},
  {name: "Teresa May", image:"images/may.png"},
  {name: "Obama", image:"images/obama.png"},
  {name: "Einstein", image:"images/einstein.png"},
  {name: "Kanye", image:"images/kanye.png"},
  /* celebs */
  {name: "Jennifer Aniston", image:"images/jennifer.png"},
  {name: "Brad Pitt", image:"images/brad.png"},

  /* once in a lifetime jokes */
  {name: "Cookie Monster", image:"images/cookie.png"},
  {name: "Elmo", image:"images/elmo.png"},
]

rand1 = Math.floor(Math.random() * (entities.length));
rand2 = -1;
while(rand1 == rand2 || rand2 == -1){
    rand2 = Math.floor(Math.random() * (entities.length));
}
rand3 = Math.floor(Math.random() * (emojis.length));


function drawViz() {

 if(window.dataArray.length == 7){
  // we got da data!
  clearInterval(refreshIntervalId);
  console.log("interval cleared");

  maxVal = 10
  dataArray.forEach(function(val){
    if(val[0].includes(";")){
      console.log("comparison");
      // we are dealing with a comparison
      if(val[0].includes(entities[rand2].name) && val[0].includes(entities[rand1].name)){
        w1 = val[1]
      } else if (val[0].includes(entities[rand2].name) && val[0].includes(emojis[rand3].name)) {
        w2 = val[1]
      } else {
        w3 = val[1]
      }

      if(val[1] > maxVal){
        maxVal = val[1];
      }
    }
  });

  w1 = (w1/maxVal)*20
  w2 = (w2/maxVal)*20
  w3 = (w3/maxVal)*20

  var data = [
      {p: [{x: 150, y: 450}, {x: 700, y: 450}], w: w1, c: 'red'},
      {p: [{x: 700, y: 450}, {x: 463, y: 100}], w: w2, c: 'blue'},
      {p: [{x: 150, y: 450}, {x: 463, y: 100}], w: w3, c: 'green'}
  ];

  // Line generator
  var line = d3.svg.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

  svg.selectAll('path')
     .data(data)
     .enter().append('path')
     .attr('d', function(d) { return line(d.p); })
     .attr('stroke-width', function(d) { return d.w; })
     .attr('stroke', function(d) { return d.c; });


  // Append images
    var rightImage = svg.append("svg:image")
        .attr("xlink:href",  function(d) { return entities[rand2].image})
        .attr("x", function(d) { return 500;})
        .attr("y", function(d) { return 250;})
        .attr("style", "max-height:250px; max-width:250px;");

     // Append images
     var leftImage = svg.append("svg:image")
           .attr("xlink:href",  function(d) { return entities[rand1].image})
           .attr("x", function(d) { return -50;})
           .attr("y", function(d) { return 250;})
           .attr("style", "max-height:250px; max-width:250px;");
           //.attr("width", 50);



   // Append images
   var emojiImage = svg.append("text")
          .attr("font-size", "7em")
          .attr("color", "black")
          .text(function(d){ return emojis[rand3].image;})
         .attr("x", function(d) { return 400;})
         .attr("y", function(d) { return 150;});
}
console.log('keep fetching data oh yeah!')
}


       var qtext = entities[rand2].name + "\n" + entities[rand1].name + "\n" + emojis[rand3].name;
       var queryText = qtext.trim();
       var queryArray = queryText.split("\n").map(addQuotesIfSpace);
       var queryLength = queryArray.length;

       window.dataArray = [['term', 'occurrences']];
       window.dataObject = {
         "single": {},
         "pair": {},
         "triplet": {}
       };


       var apiKey = "6dc9d98c-d3bd-446e-8080-20778ef1e4c9";

       var fromDate = "1990-01-01"
       var toDate = "2018-01-01"


       if (queryLength >= 1) {
         queryArray.forEach(function (queryOne) {
           var url = "https://content.guardianapis.com/search";
           url += '?' + $.param({
             'api-key': apiKey,
             'q': queryOne,
             'from-date': fromDate,
             'to-date': toDate,
           });
           $.ajax({
             url: url,
             method: 'GET',
           }).done(function(result) {
             window.dataArray.push([ queryOne, result.response.total ])
             window.dataObject["single"][queryOne] = result.response.total
             window.dataObject["pair"][queryOne] = {}
           }).fail(function(err) {
             console.log(err);
           });
         })
       }

       if (queryLength >= 2) {
         queryPairs = queryArray.pairs( function (pair) {
           console.log(pair[0], pair[1])
           console.info(pair[2])
           var queryPair = pair.join(' AND ');
           var queryPairSemicolonSep = pair.join(';');

           var url = "https://content.guardianapis.com/search";
           url += '?' + $.param({
             'api-key': apiKey,
             'q': queryPair,
             'from-date': fromDate,
             'to-date': toDate,
           });

           $.ajax({
             url: url,
             method: 'GET',
           }).done(function(result) {
             console.log("totals:")
             console.log(result.response.total)
             window.dataArray.push([ queryPairSemicolonSep, result.response.total ])
             window.dataObject["pair"][pair[0]][pair[1]] = result.response.total
           }).fail(function(err) {
             console.log(err);
           });
         })
       }

       var refreshIntervalId = setInterval(drawViz, 500);
