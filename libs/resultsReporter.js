const path = require("path");

class ResultsReporter {
	constructor() {
		this.results = [];
	}

	addResult(result) {
		this.results.push(result);
		this.logSingleResult(result);
	}

	logSingleResult(result) {
		const savings = result.originalSize - result.optimizedSize;
		const savingsPercent = ((savings / result.originalSize) * 100).toFixed(2);

		console.log(`Optimized: ${path.basename(result.inputPath)}`);
		console.log(`  Original: ${(result.originalSize / 1024).toFixed(2)}KB`);
		console.log(`  Optimized: ${(result.optimizedSize / 1024).toFixed(2)}KB`);
		console.log(
			`  Savings: ${(savings / 1024).toFixed(2)}KB (${savingsPercent}%)`,
		);
	}

	printSummary() {
		if (this.results.length === 0) {
			console.log("\nNo images were processed.");
			return;
		}

		const totalOriginal = this.results.reduce(
			(sum, r) => sum + r.originalSize,
			0,
		);
		const totalOptimized = this.results.reduce(
			(sum, r) => sum + r.optimizedSize,
			0,
		);
		const totalSavings = totalOriginal - totalOptimized;
		const totalSavingsPercent = ((totalSavings / totalOriginal) * 100).toFixed(
			2,
		);

		console.log("\n=== Optimization Summary ===");
		console.log(`Total images processed: ${this.results.length}`);
		console.log(
			`Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`,
		);
		console.log(
			`Total optimized size: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`,
		);
		console.log(
			`Total savings: ${(totalSavings / 1024 / 1024).toFixed(
				2,
			)}MB (${totalSavingsPercent}%)`,
		);
		console.log("===========================\n");
	}
}

module.exports = ResultsReporter;
