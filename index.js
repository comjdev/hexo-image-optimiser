const path = require("path");
const ImageProcessor = require("./libs/imageProcessor");

console.log("hexo-image-optimiser: Plugin initialized");

const publicDir = path.join(hexo.base_dir, "public");
const processor = new ImageProcessor(publicDir, {
	quality: 80,
	webp: true,
	avif: false,
});

// Register the before_exit hook
hexo.extend.filter.register("before_exit", async function () {
	console.log("hexo-image-optimiser: before_exit hook triggered");
	await processor.processImages();
});
