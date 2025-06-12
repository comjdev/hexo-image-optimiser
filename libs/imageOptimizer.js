const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

class ImageOptimizer {
	constructor(options = {}) {
		this.options = {
			quality: options.quality || 80,
			webp: options.webp !== false,
			avif: options.avif !== false,
			...options,
		};
	}

	async optimizeImage(inputPath) {
		try {
			// Get original file size before processing
			const originalStats = await fs.stat(inputPath);
			const image = sharp(inputPath);
			const metadata = await image.metadata();
			const outputPath = this.getOutputPath(inputPath);

			// Create a pipeline for optimization
			let pipeline = image;

			// Resize if image is too large (e.g., > 2000px in any dimension)
			if (metadata.width > 2000 || metadata.height > 2000) {
				pipeline = pipeline.resize(2000, 2000, {
					fit: "inside",
					withoutEnlargement: true,
				});
			}

			// Optimize based on image format
			switch (metadata.format) {
				case "jpeg":
				case "jpg":
					pipeline = pipeline.jpeg({ quality: this.options.quality });
					break;
				case "png":
					pipeline = pipeline.png({ quality: this.options.quality });
					break;
				case "webp":
					pipeline = pipeline.webp({ quality: this.options.quality });
					break;
				case "gif":
					// For GIFs, we'll just optimize without re-encoding
					pipeline = pipeline.gif();
					break;
				default:
					// For other formats, just copy the file
					await fs.copyFile(inputPath, outputPath);
					return {
						inputPath,
						outputPath,
						originalSize: originalStats.size,
						optimizedSize: originalStats.size,
						format: metadata.format,
					};
			}

			// Process the image
			await pipeline.toFile(outputPath);

			// Get the optimized file size
			const optimizedStats = await fs.stat(outputPath);

			return {
				inputPath,
				outputPath,
				originalSize: originalStats.size,
				optimizedSize: optimizedStats.size,
				format: metadata.format,
			};
		} catch (error) {
			console.error(`Error optimizing image ${inputPath}:`, error);
			throw error;
		}
	}

	getOutputPath(inputPath) {
		const parsed = path.parse(inputPath);
		return path.join(parsed.dir, `${parsed.name}.optimized${parsed.ext}`);
	}
}

module.exports = ImageOptimizer;
