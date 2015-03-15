  (function( global ) {

  var MyApp = (function() {

  function init() {

  (function main() {
      draw_charts(global_clients, global_offers, global_domain_groups, global_sender_domains);
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

var global_domain_groups = "all";
var global_clients = "avenue100";
var global_sender_domains = "all"
var global_offers = "all";




keyColor_20 = function(d, i) { return colors_20(d.key); };
keyColor_20b = function(d, i) { return colors_20b(d.key); };
keyColor_20_pl = function(d, i) { return colors_20_pl(d.key); };


keyColor_W = function(d, i) { return color_W(d.key); };


function draw_charts(client, offer, domain_group, sender_domain){
    send_activity(client, offer, domain_group, sender_domain);
}



function getURLParameter(name) {
  return decodeURIComponent((new RegExp('\/' + name + '\/' + '(\w)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}


$("#offer_selector li").click(function () {
    global_offers = $(this).text();
    draw_charts(global_clients, global_offers, global_domain_groups, global_sender_domains);
});

$("#domain_selector li").click(function () {
  global_domain_groups = $(this).text();
  draw_charts(global_clients, global_offers, global_domain_groups, global_sender_domains);
});

$("#sender_domain_selector li").click(function () {
  global_sender_domains = $(this).text();
  draw_charts(global_clients, global_offers, global_domain_groups, global_sender_domains);
});

$("#client_selector li").click(function () {
    global_clients = $(this).text();
    draw_charts(global_clients, global_offers, global_domain_groups, global_sender_domains);
});

$(function() {
  $("#client_selector li").click(function () {

        var data = {};
        global_clients = $(this).text();
        var url = "http://localhost:5000/activity/client/" + global_clients;
        window.open (url,'_self',false);

});

});

$(document).ready(function() {
  alert("do I get here?")
  var url = window.location.pathname;
  alert (url)
  var getClient = url.split("/").pop();
  alert(getClient)
    if (getClient != undefined || getClient != null || getClient !='client') {
        global_clients = getClient
        alert(global_clients)
        draw_charts(global_clients, global_offers, global_domain_groups, global_sender_domains);
   }
});


function send_activity(client, offer, domain_group, sender_domain){
  $.get('/api/send_activity/',
		 data = {client:client, offer:offer, domain_group:domain_group, sender_domain:sender_domain}
    ).then(
    function( data ) {
      nv.addGraph(function() {
      var chart = nv.models.lineWithFocusChart()
                            .margin({bottom: 40, left: 60, top: 30, right: 30})
                            .x(function(d) { return d3.time.format('%Y-%m-%d %H:%M:%S').parse(d.x); })
                            ;

        chart.xAxis.tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)); });
        chart.x2Axis.tickFormat(function(d) { return d3.time.format('%m/%d')(new Date(d)); });
        chart.yAxis.tickFormat(d3.format("%"));
        chart.y2Axis.tickFormat(d3.format("%"));

        d3.select("#send_activity")
            .datum(data)
            .transition().duration(500)
            .call(chart)
            ;

        nv.utils.windowResize(
                 function() {
                     chart.update();
                 });

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
