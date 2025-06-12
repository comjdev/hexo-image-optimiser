const FileScanner = require("./fileScanner");
const ImageOptimizer = require("./imageOptimizer");
const ResultsReporter = require("./resultsReporter");

class ImageProcessor {
	constructor(publicDir, options = {}) {
		this.publicDir = publicDir;
		this.optimizer = new ImageOptimizer(options);
	}

	async processImages() {
		try {
			console.log(
				"hexo-image-optimiser: Looking for public directory at:",
				this.publicDir,
			);

			const scanner = new FileScanner(this.publicDir);
			const reporter = new ResultsReporter();

			const images = await scanner.findImages();
			console.log("\n=== Found Images in Public Directory ===");
			images.forEach((img) => console.log(img));
			console.log("=======================================\n");

			console.log("hexo-image-optimiser: Starting image optimization...");

			for (const imagePath of images) {
				try {
					const result = await this.optimizer.optimizeImage(imagePath);
					reporter.addResult(result);
				} catch (err) {
					console.error(`Failed to optimize ${imagePath}:`, err);
				}
			}

			reporter.printSummary();
		} catch (err) {
			console.error("hexo-image-optimiser: Error processing images:", err);
		}
	}
}

module.exports = ImageProcessor;
