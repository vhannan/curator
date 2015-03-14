  (function( global ) {

  var MyApp = (function() {

  function init() {

  (function main() {
      draw_charts( global_domain_group, global_client, global_group_by);
      setTimeout(main, 600000);
    })();

  }
  // PUBLIC
  var public = {};
  public.init = init;

  return public;

  })();

global.MyApp = MyApp;
})( this );


var colors_20 = d3.scale.category20c();
var colors_20_pl = d3.scale.category20c();

var colors_20b = d3.scale.category20b();

var color_W = d3.scale.linear()
    .range(["#637939", "#b5cf6b"]);

var global_domain_group = "all";
var global_client = "all";
var global_group_by = "client"

keyColor_20 = function(d, i) { return colors_20(d.key); };
keyColor_20b = function(d, i) { return colors_20b(d.key); };
keyColor_20_pl = function(d, i) { return colors_20_pl(d.key); };


keyColor_W = function(d, i) { return color_W(d.key); };


function draw_charts(domain_group, client, group_by){
    revenue(domain_group, client, group_by);
    records_yahoo(client);
    records_gmail(client);
    records_hotmail(client);
    records_aol(client);
    cpr_yahoo(client);
    cpr_gmail(client);

}

$("#group_by_selector li").click(function () {
    global_group_by = $(this).text();
    draw_charts(global_domain_group, global_client, global_group_by);
});

$("#domain_selector li").click(function () {
  global_domain_group = $(this).text();
  draw_charts(global_domain_group, global_client, global_group_by);
});

$("#client_selector li").click(function () {
    global_client = $(this).text();
    draw_charts(global_domain_group, global_client, global_group_by);
});

function revenue(domain_group, client, group_by){
  $.get('/api/revenue',
		 data = {domain_group:domain_group, client:client, group_by:group_by}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.multiBarChart()
             .transitionDuration(350)
             .margin({bottom: 40, left: 80, top: 40, right: 40})
             .showControls(true)
             .reduceXTicks(true)
             .stacked(true)
             .groupSpacing(0.1) ;

     chart.xAxis
         .axisLabel("Date")
         .staggerLabels(false)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)) })
         ;

     chart.yAxis
         .tickFormat(d3.format(",.2f"))
         .axisLabel("Total Revenue ($)")
         ;

     d3.select("#revenue")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}

function cpr_yahoo(client){
  $.get('/api/cpr_yahoo',
		 data = {client:client}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.lineChart()
             .margin({bottom: 40, left: 30, top: 30, right: 30})
             .useInteractiveGuideline(true)
             .x(function(d) { return d3.time.format('%Y-%m-%d %H:%M:%S').parse(d.x); })
             ;

     chart.xAxis
         .axisLabel("Import Date")
         .staggerLabels(false)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)); })
         ;

     chart.yAxis
         .tickFormat(d3.format(".2f"))
         ;

     d3.select("#cpr_yahoo")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}

function cpr_gmail(client){
  $.get('/api/cpr_gmail',
		 data = {client:client}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.lineChart()
             .margin({bottom: 40, left: 30, top: 30, right: 30})
             .useInteractiveGuideline(true)
             .x(function(d) { return d3.time.format('%Y-%m-%d %H:%M:%S').parse(d.x); })
             ;

     chart.xAxis
         .axisLabel("Import Date")
         .staggerLabels(false)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)); })
         ;

     chart.yAxis
         .tickFormat(d3.format(".2f"))
         ;

     d3.select("#cpr_gmail")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}

function records_yahoo(client){
  $.get('/api/records_yahoo',
		 data = {client:client}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.multiBarChart()
             .transitionDuration(350)
             .color(["#9467bd", "#c5b0d5"])
             .margin({bottom: 40, left: 40, top: 40, right: 20})
             .reduceXTicks(false)
             .rotateLabels(45)
             .stacked(true)
             .showControls(false)
             .groupSpacing(0.1) ;

     chart.xAxis
         .staggerLabels(true)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)) })
         ;

     chart.yAxis
         .tickFormat(d3.format("g2"))
         .axisLabel("# of Records")
         ;

     d3.select("#records_yahoo")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}

function records_gmail(client){
  $.get('/api/records_gmail',
		 data = {client:client}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.multiBarChart()
             .transitionDuration(350)
             .color(["#8c564b", "#c49c94"])
             .margin({bottom: 40, left: 40, top: 40, right: 20})
             .reduceXTicks(false)
             .rotateLabels(45)
             .stacked(true)
             .showControls(false)
             .groupSpacing(0.1) ;

     chart.xAxis
         .staggerLabels(true)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)) })
         ;

     chart.yAxis
         .tickFormat(d3.format("g2"))
         .axisLabel("# of Records")
         ;

     d3.select("#records_gmail")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}

function records_hotmail(client){
  $.get('/api/records_hotmail',
		 data = {client:client}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.multiBarChart()
             .transitionDuration(350)
             .color(["#d62728", "#ff9896"])
             .margin({bottom: 40, left: 40, top: 40, right: 20})
             .reduceXTicks(false)
             .rotateLabels(45)
             .stacked(true)
             .showControls(false)
             .groupSpacing(0.1) ;

     chart.xAxis
         .staggerLabels(true)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)) })
         ;

     chart.yAxis
         .tickFormat(d3.format("g2"))
         .axisLabel("# of Records")
         ;

     d3.select("#records_hotmail")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}

function records_aol(client){
  $.get('/api/records_aol',
		 data = {client:client}
    ).then(
    function( data ) {
    nv.addGraph(function() {
    'use strict'
    var chart = nv.models.multiBarChart()
             .transitionDuration(350)
             .color(["#31a354", "#c7e9c0"])
             .margin({bottom: 40, left: 40, top: 40, right: 20})
             .reduceXTicks(false)
             .rotateLabels(45)
             .stacked(true)
             .showControls(false)
             .groupSpacing(0.1) ;

     chart.xAxis
         .staggerLabels(true)
         .tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)) })
         ;

     chart.yAxis
         .tickFormat(d3.format("g2"))
         .axisLabel("# of Records")
         ;

     d3.select("#records_aol")
         .datum(data)
         .transition().duration(300).call(chart);

     nv.utils.windowResize(
             function() {
                 chart.update();
             }
         );

     return chart;
     })


   },


   function( xhr, status, error ) {
       alert('I don’t think your flask app is running properly.' );
   }
 );

}


$( function() {
  MyApp.init();
});
