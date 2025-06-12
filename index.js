"use strict";

const OptimizeImage = require("./lib/optimizeImage");

hexo.extend.filter.register("after_generate", function () {
	console.log("hexo-image-optimiser: after_generate filter fired");
	return OptimizeImage.call(hexo);
});
