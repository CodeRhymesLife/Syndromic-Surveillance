// Contains all country data
	// Eventually, within each country we can contain city data as well.
	// So when we zoom in we can display markers for each city
	countryData = {
		"Haiti": {
			diseases: {
				"Cholera": 100,
			},
			population: null,
			cities: null,
		},
		"Madagascar": {
			diseases: {
				"Bubonic Plague": 100,
			},
			population: null,
			cities: null,
		},
		"Sierra Lione": {
			diseases: {
				"Ebola": 100,
			},
			population: null,
			cities: {
				"Freetown": {
					diseases: {
						"Ebola": 300,
					},
					population: 1170200,
				},
				"Bo": {
					diseases: {
						"Ebola": 10,
					},
					population: 243266,
				},
				"Kenema": {
					diseases: {
						"Ebola": 33,
					},
					population: 188463,
				},
				"Makeni": {
					diseases: {
						"Ebola": 50,
					},
					population: 112489,
				},
				"Koidu Town": {
					diseases: {
						"Ebola": 3,
					},
					population: 111800,
				},
			}
		},
		"Guinea": {
			diseases: {
				"Ebola": 100,
			},
			population: null,
		},
		"Liberia": {
			diseases: {
				"Ebola": 100,
			},
			population: null,
		},
	};
	
Meteor.startup(function () {	
	// Hook up zoom events
	window.addEventListener("load", function() {
		zoomIn.addEventListener("click", zoomInToLastSelectedRegion);
		zoomOut.addEventListener("click", zoomOutToWorld);
	});
});

/*
	Fired when a region is selected
*/
function onRegionClick(region) {
	cityChart.region = region
}

/*
	Zoom in to the last selected region
*/
function zoomInToLastSelectedRegion() {
	cityChart.draw();
	legend.style.display = "none";
}

/*
	Zoom out to the full map view
*/
function zoomOutToWorld() {
	drawRegionsMap();
}

/*
	Draw the chart
*/
drawRegionsMap = function (region) {
	regionChart.draw(zoomInToLastSelectedRegion, onRegionClick);
}