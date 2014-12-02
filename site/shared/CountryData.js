// Global collection of country data
Countries = new Meteor.Collection("countries");
Cities = new Meteor.Collection("cities");

if (Meteor.isServer) {
	Meteor.publish("countries", function () {
		return Countries.find();
	});
	
	Meteor.publish("cities", function () {
		return Cities.find();
	});

	Meteor.startup(function () {
	    DataParser.initialize();
	});
}