import { rimraf } from 'rimraf';
import { resolve } from 'path';
import { pathToFileURL } from 'url';
import chalk from 'chalk';
import { promises as fs } from 'fs';

export async function clearDirectory(dirPath) {
	if (!dirPath) {
		console.error('Path not specified. Current: ', chalk.cyan(dirPath));
		return;
	}

	const absoluteDirPath = resolve(dirPath);

	try {
		const files = await fs.readdir(absoluteDirPath);

		if (files.length === 0) {
			console.log(`Directory ${chalk.cyan(dirPath)} is already empty`);
			return;
		}

		let deletedFilesCount = 0;
		let deletedDirsCount = 0;

		await rimraf(absoluteDirPath, {
			glob: { dot: true },
			filter: (path, stats) => {
				const isRootDirectory = path === absoluteDirPath;
				if (isRootDirectory) {
					return false;
				}

				if (stats.isDirectory()) {
					deletedDirsCount++;
					return true;
				} else if (stats.isFile()) {
					deletedFilesCount++;
					return true;
				}

				return false;
			},
		});

		console.log(
			`${chalk.yellow('Deleted')} ${chalk.bold.cyan(deletedFilesCount)} file(s) and ${chalk.bold.cyan(deletedDirsCount)} directorie(s) from ${chalk.cyan(dirPath)}`,
		);
	} catch (e) {
		if (e.code === 'ENOENT') {
			console.error(`Directory ${chalk.cyan(dirPath)} does ${chalk.red('not exist')}`);
		} else {
			console.error(`Content of ${chalk.cyan(dirPath)} couldn't be deleted due to ${chalk.red('an error')}`, e);
		}
	}
}

const scriptFilePath = pathToFileURL(resolve(process.argv[1])).href;
if (import.meta.url === scriptFilePath) {
	const executionPath = process.cwd();
	const targetDir = process.argv[2];
	const fullPath = resolve(executionPath, targetDir);
	if (!targetDir) {
		console.error('Please provide a target directory as an argument.');
		process.exit(1);
	}

	clearDirectory(fullPath);
}

export default clearDirectory;
