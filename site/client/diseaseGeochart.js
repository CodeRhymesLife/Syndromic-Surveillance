function DiseaseGeochart() {
	// A set of colors we can use in our chart
	this.colors = [ "red", "green", "blue", "yellow", "purple", "orange" ];
	
	// We need to associate an id with each color to give to the
	// chart so it knows which values to associate with what colors.
	// We also use this to build our legend
	var colorCounter = 0;
	var colorIndexes = [];
	this.colors.forEach(function (c) {
		colorIndexes.push(colorCounter++);
	});
	this.colorIndexes = colorIndexes;
}

DiseaseGeochart.prototype.draw = function(itemSelected, regionClicked) {
	chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
	
	data = this.getData();
	chart.draw(data, this.getOptions());
	
	// Region click event handler
	var onRegionClick = function(e) {
		regionClicked(e.region);
	}

	// Hook up events
	google.visualization.events.addListener(chart, 'select', itemSelected);
	google.visualization.events.addListener(chart, 'regionClick', onRegionClick);
};

DiseaseGeochart.prototype.getData = function() {
	throw "Not Implemented"; 
};

RegionGeochart.prototype = new DiseaseGeochart();
RegionGeochart.prototype.constructor = RegionGeochart;
function RegionGeochart() {
}

RegionGeochart.prototype.getData = function() {
	// Initialize the legend
	legend.style.display = "block";
	legend.innerHTML = "";

	// Create the data object and add columns.
	// We don't want to display the disease column that's used for coloring,
	// so instead we add a tooltip column
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Country');
	data.addColumn("number", "DiseaseColor");
	data.addColumn({type:'string', role:'tooltip'});
	
	var countryData = [];
	var countryNameData = Countries.find({}, { sort: {Country: 1}, fields: {Country: true} }).fetch()
	var uniqueCountryNames = _.uniq(countryNameData.map(function(x) {
			return x.Country;
		}), true);
	
	// Add the oldest entry to the country data collection
	uniqueCountryNames.forEach(function (countryName) {
		countryData.push(
			// Get the oldest country
			Countries.find({ Country: countryName }, { sort: { Date: 1 }, limit: 1 }).fetch()[0]
			);
	});

	// Add each country to the dataset and
	// use a different color for each disease
	var colorCounter = 0;
	var diseaseColorMap = {};
	countryData.forEach(function (country) {
		// If we haven't seen this disease save it's color
		// and increment our counter
		if(!diseaseColorMap[country.Disease])
		{
			// If we've used up all of our colors
			// throw an exception.
			if(colorCounter >= this.colorIndexes.length)
				throw "We need more colors!"
		
			var diseaseColorIndex = this.colorIndexes[colorCounter++];
			diseaseColorMap[country.Disease] = diseaseColorIndex;
			
			// Update our legend with the new color
			var diseaseLegendEntry = document.createElement("li");
			diseaseLegendEntry.innerHTML = "<div class='diseaseColor' style='background-color: " + this.colors[diseaseColorIndex] + "'></div>" +
				"<label>" + country.Disease + "</label>" +
				"<div style='clear: both;'></div>";
			
			legend.appendChild(diseaseLegendEntry);
		}
		
		// Add a row for the country
		data.addRow([
			country.Country,				// Country name
			diseaseColorIndex,				// Disease color
			"Disease: " + country.Disease	// Hover tooltip
		]);
	}, this);
	
	return data; 
};

RegionGeochart.prototype.getOptions = function() {
	return {
		legend: 'none',
		colorAxis: {
			colors: this.colors,
			values: this.colorIndexes
		}
	};
};

CityGeochart.prototype = new DiseaseGeochart();
CityGeochart.prototype.constructor = CityGeochart;
function CityGeochart() {
	this.region = "GN";
}

CityGeochart.prototype.getData = function() {
	// Create the data object and add columns.
	// We don't want to display the disease column that's used for coloring,
	// so instead we add a tooltip column
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'City');
	data.addColumn("number", "Population");
	data.addColumn("number", "Area");
	data.addColumn({type:'string', role:'tooltip'});
	
	// Loop over each country and add it's cities' disease counts
	var colorCounter = 0;
	var diseaseColorMap = {};
	for(var countryName in countryData)
	{
		var country = countryData[countryName];
		
		// If we don't have any cities go to the next country
		if(!country.cities)
			continue;
		
		// Loop through each country's cities and add an entry for them
		for(var cityName in country.cities)
		{
			var city = country.cities[cityName];
			
			// Loop over each disease in this city and add an entry for each count
			for(var diseaseName in city.diseases)
			{
				var diseaseToll = country.diseases[diseaseName];
				
				// Add a row for the country
				data.addRow([
					cityName,						// Country
					city.population,				// Population
					diseaseToll,					// Disease toll
					"Disease: " + diseaseName		// Hover tooltip
				]);
			}
		}
		
	}
	
	return data; 
};

CityGeochart.prototype.getOptions = function() {
	// If region was not specified default to the world view
	if(typeof this.region != 'string')
		this.region = 'world';

	return {
		displayMode: "markers",
		region: this.region,
		colorAxis: {colors: ['green', 'blue']}
	};
};

regionChart = new RegionGeochart();
cityChart = new CityGeochart();