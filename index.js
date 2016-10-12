module.exports = (function() {
	"use strict";
	
	var fs = require("fs");
	var Converter = require("csvtojson").Converter;
	
	function databot(input, output, context) {
		if (!input.dataInId || !input.outPath) {
			output.error("invalid arguments - please supply dataInId, outPath");
			process.exit(1);
		}
		
		const dataInId = input.dataInId;
		const outPath = input.outPath;
		
		var csvConverter = new Converter();
		//record_parsed will be emitted each time a row has been parsed.
		csvConverter.on("record_parsed", function(resultRow) {});
		
		const api = context.tdxApi;
		
		var request = api.getRawFile(dataInId);
		
		var stream = fs.createWriteStream(outPath);
		
		output.debug("fetching data for %s", dataInId);
		
		request.pipe(csvConverter).pipe(stream)
			.on("finish", function() {
				output.debug("got data");
				
				console.log("got json file");
			})
			.on("error", function(err) {
				output.error("failure during request: %s", err.message);
				process.exit(1);
			});
	}
	
	var input = require("nqm-databot-utils").input;
	input.pipe(databot);
}());
