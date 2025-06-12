"use strict";

const sharp = require("sharp");
const Promise = require("bluebird");
const { minimatch } = require("minimatch");

function OptimizeImage() {
	// Init.
	const hexo = this;
	const options = hexo.config.image_minifier || {
		enable: true,
		quality: 80,
		progressive: true,
		interlaced: true,
		optimizationLevel: 3,
		multipass: true,
		silent: false,
	};
	const route = hexo.route;
	let targetfile = ["jpg", "jpeg", "png", "webp"];

	// Return if disabled.
	if (options.enable === false) return;

	// Filter target files
	if (options.exclude && options.exclude.length) {
		targetfile = targetfile.filter((t) =>
			options.exclude.every((p) => !p.includes(t)),
		);
	}

	// Get all image routes
	const routes = route.list().filter((path) => {
		const pattern = "*.{" + targetfile.join(",") + "}";
		return minimatch(path, pattern, {
			nocase: true,
			matchBase: true,
		});
	});

	const log = hexo.log || console;

	// Process each image
	return Promise.map(routes, (path) => {
		// Get the image buffer
		const stream = route.get(path);
		const arr = [];
		stream.on("data", (chunk) => arr.push(chunk));

		return new Promise((resolve, reject) => {
			stream.on("end", () => resolve(Buffer.concat(arr)));
		}).then((buffer) => {
			// Get image format from path
			const format = path.split(".").pop().toLowerCase();

			// Create Sharp instance with appropriate options
			let sharpInstance = sharp(buffer);

			// Apply format-specific optimizations
			switch (format) {
				case "jpg":
				case "jpeg":
					sharpInstance = sharpInstance.jpeg({
						quality: options.quality,
						progressive: options.progressive,
					});
					break;
				case "png":
					sharpInstance = sharpInstance.png({
						quality: options.quality,
						progressive: options.progressive,
					});
					break;
				case "webp":
					sharpInstance = sharpInstance.webp({
						quality: options.quality,
					});
					break;
			}

			// Optimize the image
			return sharpInstance
				.toBuffer()
				.then((newBuffer) => {
					const length = buffer.length;
					if (newBuffer && length > newBuffer.length) {
						const saved = (
							((length - newBuffer.length) / length) *
							100
						).toFixed(2);
						log[options.silent ? "debug" : "info"](
							"Optimized image: %s [%s saved]",
							path,
							saved + "%",
						);
						route.set(path, newBuffer);
					}
				})
				.catch((err) => {
					log.error("Error optimizing image %s: %s", path, err.message);
				});
		});
	});
}

module.exports = OptimizeImage;
