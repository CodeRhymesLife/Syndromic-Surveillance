var fs = Npm.require("fs");

// parses country from files and stores a cached version that exposes public accessors to get the levels
function dataParser() {
	// the list of levels. this should never be accessed directly (except by the getAllLevels function)
	// all access should be done through getAllLevels() which implements caching
	var levels = null;

    var rootDir = process.cwd() + '/server/data/';

	// private function to parse all files from the specified directory and build an array of objects
	var getObjectsFromFilesInDir = function (dir) {
		var fileObjects = [];
		console.log('Looking in directory ' + dir);

        // Get a list of files in the given dir
		var files = null;
	    try{
	        files = fs.readdirSync(dir);
	    }
	    catch(e) {
	        console.log('Unable to read dir ' + dir);
	        return;
	    }
		
        // Read and save the contents of each file
	    for (var fileKey in files) {
	        var fileName = files[fileKey];
	        console.log('Reading file ' + fileName);

		    try{
		        var fileContents = fs.readFileSync(dir + '/' + fileName, 'utf8');
		        var objectsArray = JSON.parse(fileContents);
				
				for(var i = 0; i < objectsArray.length; i++)
				{
					fileObjects.push(objectsArray[i]);
				}
		    }
		    catch(e) {
		        console.log('Unable to read file ' + fileName);
				console.log('Exception: ' + e.message);
		        continue;
		    }
	    }

		console.log("Finished parsing files. File");
		return fileObjects;
	}

	this.initialize = function () {
		// Clear the collection first in case we had already added levels
		Countries.remove({});
		Cities.remove({});
		
		var allFileData = getObjectsFromFilesInDir(rootDir);
		
		for (var i = 0; i < allFileData.length; i++) {
			var data = allFileData[i];
			
			if(data.hasOwnProperty("Location"))
				Cities.insert(data);
			else
				Countries.insert(data);
		}
		
		console.log("Initialized country collection. Country count: ", Countries.find().count());
		console.log("Initialized city collection. City count: ", Cities.find().count());
	}
}

DataParser = new dataParser();