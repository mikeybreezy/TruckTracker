/**************************************************************************
	
	Much of this code was adapted from Logan Mortimer and his tutorial on 
	how to "Build an Exercise Tracking App: Persistence & Graphing"
	(http://mobile.tutsplus.com/tutorials/mobile-web-apps/build-an-exercise-tracking-app-persistence-graphing/)
	Published June 8th 2012

***************************************************************************/


/** @file       TruckTracker.js
 *  @brief      Various functions used to run the TruckTracker app 
 *				  
 *  @details    Uses EventListeners to manage the specific functions that occur at various events
 *				
 *				onDeviceReady
 *				clrStorage
 *				seedGPS
 *				gps_distance
 *
 *
 *  @author     Michael Barnes		micbarn@rams.colostate.edu
 *  @date       7/18/2013
*/



/* Function for the main event listener at init.
	--Make sure internet access is avail
	--declare event listeners for buttons
		--Home
			--Clear local storage
			--Load seed gps data
		--Track Workout
			--Start
			--Stop
		--History
*/
function onDeviceReady() {
	//check for internet action --refresh if none
	if(navigator.network.connection.type == Connection.NONE){
		$("#home_network_button").text('No Internet Access')
								 .attr("data-icon", "delete")
								 .button('refresh');
	}

	//Event listeners
	document.getElementById("home_clearstorage_button").addEventListener("click", clrStorage, false);
	document.getElementById("home_seedgps_button").addEventListener("click", seedGPS, false);
	document.getElementById("startTracking_start").addEventListener("click", StartButton, false);
	document.getElementById("startTracking_stop").addEventListener("click", StopButton, false);
	document.getElementById("history_tracklist").addEventListener("click", historyBtn, false);

}
	
//clear local storage
function clrStorage() { 
	window.localStorage.clear(); 
}

//seed GPS data for emulation
function seedGPS() {
	window.localStorage.setItem(
		'Sample block', 
		'[{"timestamp":1335700802000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33488333333335,
				"accuracy":0,
				"latitude":-45.87475166666666,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700803000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33481666666665,
				"accuracy":0,
				"latitude":-45.87465,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700804000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33426999999998,
				"accuracy":0,
				"latitude":-45.873708333333326,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700805000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33318333333335,
				"accuracy":0,
				"latitude":-45.87178333333333,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700806000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33416166666666,
				"accuracy":0,
				"latitude":-45.871478333333336,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700807000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33526833333332,
				"accuracy":0,
				"latitude":-45.873394999999995,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700808000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33427333333336,
				"accuracy":0,
				"latitude":-45.873711666666665,
				"speed":null,
				"altitudeAccuracy":null}},

			{"timestamp":1335700809000,
			"coords":{
				"heading":null,
				"altitude":null,
				"longitude":170.33488333333335,
				"accuracy":0,
				"latitude":-45.87475166666666,
				"speed":null,
				"altitudeAccuracy":null}}]');

}

function StartButton() {
	// Start tracking the User
    watch_id = navigator.geolocation.watchPosition(
    	// Success
        function(position){
            tracking_data.push(position);
        },
        // Error
        function(error){
            console.log(error);
        }, 
        // Settings
        { frequency: 3000, enableHighAccuracy: true });

    // Tidy up the UI
    track_id = $("#track_id").val(); //get track_id info from text field 
    $("#track_id").hide(); //hide the track_id field
    //display "Tracking workout: track_id" in place of prev txt field.
    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
}

function StopButton(){
	// Stop tracking the user
	navigator.geolocation.clearWatch(watch_id);
	// Save the tracking data
	window.localStorage.setItem(track_id, JSON.stringify(tracking_data));

	// Reset watch_id and tracking_data 
	watch_id = null;
	//gotta set the tracking to an empty array to reset
	tracking_data = []; //don't use null or it'll crash! xD

	// Tidy up the UI
	$("#track_id").val("").show(); //display track_id again
	//print stop message
	$("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");
}

function gps_distance(lat1, lon1, lat2, lon2){
	/* Check out Movable Type Scripts site to get more info
		on how to calculate distance, bearing, & more between
		Lat/Long points.

	--> http://www.movable-type.co.uk/scripts/latlong.html <--   */

    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d;
}



//*****************************************************************************************
//--> Init event listener that calls deviceready function which calls all other functions
//*****************************************************************************************

var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects
document.addEventListener("deviceready", onDeviceReady, false);

// When the user views the history page
$('#history').on('pageshow', function () {
	
	// Count the number of entries in localStorage and display this information to the user
	tracks_recorded = window.localStorage.length;
	$("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");
	
	// Empty the list of recorded tracks
	$("#history_tracklist").empty();
	
	// Iterate over all of the recorded tracks, populating the list
	for(i=0; i<tracks_recorded; i++){
		$("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
	}
	
	// Tell jQueryMobile to refresh the list
	$("#history_tracklist").listview('refresh');

});

// When the user clicks a link to view track info, set/change the track_id attribute on the track_info page.
$("#history_tracklist li a").on('click', function(){

	$("#track_info").attr("track_id", $(this).text());
	
});


// When the user views the Track Info page
$('#track_info').on('pageshow', function(){

	// Find the track_id of the workout they are viewing
	var key = $(this).attr("track_id");
	
	// Update the Track Info page header to the track_id
	$("#track_info div[data-role=header] h1").text(key);
	
	// Get all the GPS data for the specific workout
	var data = window.localStorage.getItem(key);
	
	// Turn the stringified GPS data back into a JS object
	data = JSON.parse(data);

	// Calculate the total distance travelled
	total_km = 0;

	for(i = 0; i < data.length; i++){
	    
	    if(i == (data.length - 1)){
	        break;
	    }
	    
	    total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
	}
	
	total_km_rounded = total_km.toFixed(2);
	
	// Calculate the total time taken for the track
	start_time = new Date(data[0].timestamp).getTime();
	end_time = new Date(data[data.length-1].timestamp).getTime();

	total_time_ms = end_time - start_time;
	total_time_s = total_time_ms / 1000;
	
	final_time_m = Math.floor(total_time_s / 60);
	final_time_s = total_time_s - (final_time_m * 60);

	// Display total distance and time
	$("#track_info_info").html('Travelled <strong>' + total_km_rounded + '</strong> km in <strong>' + final_time_m + 'm</strong> and <strong>' + final_time_s + 's</strong>');
	
	// Set the initial Lat and Long of the Google Map
	var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

	// Google Map options
	var myOptions = {
      zoom: 15,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Create the Google Map, set options
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var trackCoords = [];
    
    // Add each GPS entry to an array
    for(i=0; i<data.length; i++){
    	trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
    }
    
    // Plot the GPS entries as a line on the Google Map
    var trackPath = new google.maps.Polyline({
      path: trackCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    // Apply the line to the map
    trackPath.setMap(map);
   
		
});


// --> Old event handler structure <--
/*
$("#startTracking_start").on('click', function(){
    
	// Start tracking the User
    watch_id = navigator.geolocation.watchPosition(
    
    	// Success
        function(position){
            tracking_data.push(position);
        },
        
        // Error
        function(error){
            console.log(error);
        },
        
        // Settings
        { frequency: 3000, enableHighAccuracy: true });
    
    // Tidy up the UI
    track_id = $("#track_id").val();
    
    $("#track_id").hide();
    
    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
});


$("#startTracking_stop").on('click', function(){
	
	// Stop tracking the user
	navigator.geolocation.clearWatch(watch_id);
	
	// Save the tracking data
	window.localStorage.setItem(track_id, JSON.stringify(tracking_data));

	// Reset watch_id and tracking_data 
	watch_id = null;
	tracking_data = [];

	// Tidy up the UI
	$("#track_id").val("").show();
	
	$("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");

});
*/