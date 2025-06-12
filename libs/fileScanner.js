const path = require("path");
const fs = require("fs").promises;

class FileScanner {
	constructor(publicDir) {
		this.publicDir = publicDir;
	}

	async findImages() {
		try {
			await this.checkPublicDir();
			const images = await this.scanDirectory(this.publicDir);
			return images;
		} catch (err) {
			console.error("hexo-image-optimiser: Error scanning for images:", err);
			throw err;
		}
	}

	async checkPublicDir() {
		try {
			await fs.access(this.publicDir);
			console.log(
				"hexo-image-optimiser: public directory exists, scanning for images...",
			);
		} catch (err) {
			console.error("hexo-image-optimiser: public directory not found:", err);
			throw err;
		}
	}

	async scanDirectory(dir) {
		const files = await fs.readdir(dir, { withFileTypes: true });
		const imageFiles = [];

		for (const file of files) {
			const fullPath = path.join(dir, file.name);

			if (file.isDirectory()) {
				imageFiles.push(...(await this.scanDirectory(fullPath)));
			} else if (this.isImageFile(file.name)) {
				imageFiles.push(fullPath);
			}
		}

		return imageFiles;
	}

	isImageFile(filename) {
		const ext = path.extname(filename).toLowerCase();
		return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext);
	}
}

module.exports = FileScanner;
