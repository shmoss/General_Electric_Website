/**
 * @author Starr
 */

/* Map of GeoJSON data from MegaCities.geojson */
var statesData
var worldCountries
var GE_Countries = L.geoJson(GE_Countries)
var GE_Cities = L.geoJson(GE_Cities)
var map = L.map('map', {
        //set geographic center
        center: [41.4, -110],
        //set initial zoom level
        zoom: 4,
        maxZoom: 8,
        minZoom: 2
    });
var attribute;
var attributes;
var index;
var response;
var popupContent;
var IndexCounter = 0; //tracks attribute being mapped
var geoJsonLayers = {};

console.log(geoJsonLayers)


//function to instantiate the Leaflet map

    //create the map
    // map = L.map('map', {
    // 	//set geographic center
    //     center: [41.4, -110],
    //     //set initial zoom level
    //     zoom: 4,
    //     maxZoom: 8,
    //     minZoom: 2
    // });


//add OSM base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    	//set attribute info (source)
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        //and add it to map

    }).addTo(map);
    // L.geoJson(worldCountries).addTo(map);
    console.log(GE_Countries)

    //call getData function- will add our MegaCities data to the map
    getData(map);
    //getWorldData(map)
    getCountryData(map)

    getUSAData(map)
   
    console.log(GE_Countries)
    console.log(GE_Cities)
    console.log
    



map.on('zoomend', function () {
    console.log("level")
    zoomLevel = map.getZoom()
    console.log(zoomLevel)
    if (map.getZoom() <7) {
        map.removeLayer(GE_Cities);
    }
}); 

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//Create popups with attribute information, based on raw and normalized attributes
function createPopup(properties, attribute, layer, radius){
    //add city to popup content string
    var popupContent = '<h3>' + properties.GE_City + '</h3> ';
    //add formatted attribute to panel content 
    
    popupContent += "<p><b>Number of Installs:</b> " + properties.GE_Count + "</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
};

//convert geojson markers to circle markers
function pointToLayer(feature, latlng, attributes){
    attribute = attributes[1];
    //console.log(attribute)
	

  	//console.log(attributes)
    //create marker style
    var options = {
        fillColor: "#ffff32",
        color: "#666600",
        weight: 1,
        opacity: .6,
        fillOpacity: 0.8
    };

     //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    createPopup(feature.properties, attribute, layer, options.radius);

    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        },
        click: function(){
            $("#panel").html(popupContent);
        }
    });


    return layer;
};

//we'll create a Leaflet GeoJSON layer and add it to map, taking "response" data as parameter
function createPropSymbols(data, map, attribute, layername) {
	var layer = L.geoJson(data, {
		//create a layer from original geojson points
		pointToLayer: function(feature, latlng){
			//instead of markers, we want circles, so we return the geojsonMarkerOptions function with circle specs
			return pointToLayer(feature, latlng, attributes);
			}
		//now, we need to add the circle layer to the map		
	}).addTo(map);
    geoJsonLayers[layername] = layer;
    console.log(layer)
    return layer

}

function processData(data){
    //empty array to hold attributes
    attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("GE") > -1){
            attributes.push(attribute);
        };
    };
    console.log(attributes)
    return attributes;
};

function processCountryData(data){
    //empty array to hold attributes
    attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("GE") > -1){
            attributes.push(attribute);
        };
    };
    console.log(attributes)
    return attributes;
};

function processUSAData(data){
    //empty array to hold attributes
    attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("GE") > -1){
            attributes.push(attribute);
        };
    };
    console.log(attributes)
    return attributes;
};

function getData(map){
	//ajax function to get MegaCities data layer loaded into map
	$.ajax("data/Cities_US4.GeoJSON", {
		//datatype specified
		dataType: "json",
		//upon success, call the following function
		success: function(response){
            attributes = processData(response); 
			 //call function to create proportional symbols
            createPropSymbols(response, map, attributes, "cities");
			
			console.log(attributes)
            return response

		}	
	});
}

function getWorldData(map){
    //ajax function to get MegaCities data layer loaded into map
    $.ajax("data/worldCountries.GeoJSON", {
        //datatype specified
        dataType: "json",
        //upon success, call the following function
        success: function(response){
           
            
            console.log(response)
            return response

        }   
    });
}

function getCountryData(map){
    //ajax function to get MegaCities data layer loaded into map
    $.ajax("data/GE_Countries.GeoJSON", {
        //datatype specified
        dataType: "json",
        //upon success, call the following function
        success: function(response){
            attributes = processCountryData(response)
            createPropSymbols(response, map, attributes, "countries");
            console.log(response)
            return response

        }   
    });
}

function getUSAData(map){
    //ajax function to get MegaCities data layer loaded into map
    $.ajax("data/GE_Countries_2.GeoJSON", {
        //datatype specified
        dataType: "json",
        //upon success, call the following function
        success: function(response){
            attributes = processUSAData(response)
            createPropSymbols(response, map, attributes, "usa");
            map.removeLayer(geoJsonLayers.usa)
            console.log("hiiii")
            console.log(response)
            return response

        }   
    });
}

//function to determine whether or not to show raw or normalized attribute
function selectValues(map) {   
        //create "raw" and "normalized" buttons
        $('#panel').append('<button class="Cities" style="-moz-box-shadow: 0px 10px 14px -7px #383838; -webkit-box-shadow: 0px 10px 14px -7px #383838; box-shadow: 0px 10px 14px -7px #383838; background-color:#FFF; -moz-border-radius:8px; -webkit-border-radius:8px; border-radius:8px; display:inline-block; cursor:pointer; color:#000000; font-family:avenir; font-size:14px; font-weight:bold; padding:8px 14px; text-decoration:none;">Show Cities</button>');
        $('#panel').append('<button class="Countries" style="-moz-box-shadow: 0px 10px 14px -7px #383838; -webkit-box-shadow: 0px 10px 14px -7px #383838; box-shadow: 0px 10px 14px -7px #383838; background-color:#FFF; -moz-border-radius:8px; -webkit-border-radius:8px; border-radius:8px; display:inline-block; cursor:pointer; color:#000000; font-family:avenir; font-size:14px; font-weight:bold; padding:8px 14px; text-decoration:none;">Show Countries</button>');
        
     //If normalized button hit, call function
    $(".Cities").click(function(){
        console.log("cities")
        // var index = $('.range-slider').val();
        //  normalized = true
        //  raw = false
        // //create true false statement
        // if (normalized == true) {
        // //if true, update based on normalized attributes
        //     updatePropSymbols(map, attributes[index], rawAttributes[index]);
        // };
       
     map.setZoom(4)
     if (map.hasLayer(geoJsonLayers.countries)){
        map.removeLayer(geoJsonLayers.countries)
        map.addLayer(geoJsonLayers.cities)
        map.removeLayer(geoJsonLayers.usa)
     }
     console.log(GE_Cities)
     
    });
   
    $(".Countries").click(function(){
        // var index = $('.range-slider').val();
        // //re-set statement
        // normalized = false
        // raw = true
        // if (raw == true) {
        //     //take off previous layer
        //     map.removeLayer(attributes);
        //     //call update prop symbols based on normalized data
        //     updatePropSymbols(map, rawAttributes[index], attributes[index]);        
        // };
    map.setZoom(2)
    if (map.hasLayer(geoJsonLayers.cities)){
        map.removeLayer(geoJsonLayers.cities)
        map.addLayer(geoJsonLayers.countries)
        map.addLayer(geoJsonLayers.usa)
};
});
}

selectValues(map)    
//way at the bottom- we call the create map function once the doc has loaded.
//$(document).ready(createMap);
function readZoom() {
    console.log("readZoom function")
     if (map.getZoom() <7) {
        console.log("hello");
    }
}

readZoom()