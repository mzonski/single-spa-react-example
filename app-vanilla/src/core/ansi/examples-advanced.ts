import ANSIStringFormatter from './ANSIStringFormatter';
import { ANSIColor, RGBColor, ValidRGBColor } from './types';

// Example 1: wrapWithANSI
console.log(ANSIStringFormatter.wrapWithANSI('Custom formatting', '1', '31', '44'));
// Output: Bold red text on blue background

// Example 2: formatWithColor
console.log(ANSIStringFormatter.formatWithColor('Red text', 'red'));
console.log(ANSIStringFormatter.formatWithColor('Blue background', 'blue', 'background'));
// Output: Text in red color
// Output: Text with blue background

// Example 3: formatWithRGB
console.log(ANSIStringFormatter.formatWithRGB('Custom RGB color', [100, 150, 200]));
console.log(ANSIStringFormatter.formatWithRGB('Custom RGB background', [50, 100, 150], 'background'));
// Output: Text in custom RGB color
// Output: Text with custom RGB background

// Example 4: formatWithHex
console.log(ANSIStringFormatter.formatWithHex('Hex color text', '#FF5733'));
console.log(ANSIStringFormatter.formatWithHex('Hex color background', '#33FF57', 'background'));
// Output: Text in hex-specified color
// Output: Text with hex-specified background color

// Example 5: formatWithStyle
console.log(ANSIStringFormatter.formatWithStyle('Bold text', 'bold'));
console.log(ANSIStringFormatter.formatWithStyle('Underlined text', 'underline'));
// Output: Text in bold
// Output: Underlined text

// Example 6: formatComplex
console.log(
	ANSIStringFormatter.formatComplex('Complex formatting', {
		color: 'red',
		backgroundColor: 'yellow',
		styles: ['bold', 'underline'],
		rgbColor: [100, 150, 200],
		hexBackgroundColor: '#33FF57',
	}),
);
// Output: Text with multiple formatting options applied

// Example 7: reset
console.log(
	`${ANSIStringFormatter.formatWithColor('Colored text', 'red')}${ANSIStringFormatter.reset('color')} Reset color`,
);
console.log(
	`${ANSIStringFormatter.formatWithStyle('Bold text', 'bold')}${ANSIStringFormatter.reset('bold')} Reset bold`,
);
console.log(
	`${ANSIStringFormatter.formatComplex('Complex', { color: 'red', backgroundColor: 'yellow', styles: ['bold'] })}${ANSIStringFormatter.reset()} Full reset`,
);
// Output: Colored text followed by reset color text
// Output: Bold text followed by reset bold text
// Output: Complex formatted text followed by fully reset text

// Example 8: rainbow
console.log(ANSIStringFormatter.rainbow('Rainbow text'));
// Output: Text with each character in a different color

// Example 9: gradient
console.log(ANSIStringFormatter.gradient('Gradient text', [255, 0, 0], [0, 0, 255]));
// Output: Text with a color gradient from red to blue

// Example 10: Combining methods
console.log(
	ANSIStringFormatter.formatComplex(
		ANSIStringFormatter.rainbow('Rainbow') +
			' meets ' +
			ANSIStringFormatter.gradient('Gradient', [0, 255, 0], [0, 0, 255]),
		{ backgroundColor: 'yellow', styles: ['bold', 'underline'] },
	),
);
// Output: Rainbow text and gradient text combined, with yellow background, bold and underlined

// Example 11: Using reset with complex formatting
const complexText = ANSIStringFormatter.formatComplex('Complex Formatting', {
	color: 'red',
	backgroundColor: 'cyan',
	styles: ['bold', 'italic'],
});
console.log(`${complexText}${ANSIStringFormatter.reset()} Back to normal`);
// Output: Complex formatted text followed by normal text

// Example 12: Nested formatting
console.log(
	ANSIStringFormatter.formatWithColor(
		`Red text ${ANSIStringFormatter.formatWithColor('Blue text', 'blue')} Red again`,
		'red',
	),
);
// Output: Red text with a blue text segment in the middle

// Example 13: Using formatWithRGB for both text and background
const rgbText = ANSIStringFormatter.formatWithRGB('Foreground', [200, 100, 50]);
const rgbBackground = ANSIStringFormatter.formatWithRGB('Background', [50, 100, 200], 'background');
console.log(`${rgbText} and ${rgbBackground}`);
// Output: Text with custom RGB foreground color followed by text with custom RGB background color

// Example 14: Creating a color palette
const palette = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'] as const;
const colorPalette = palette.map((color) => ANSIStringFormatter.formatWithColor(`■ ${color}`, color)).join(' ');
console.log(colorPalette);
// Output: A row of colored squares with their color names

// Example 15: Text decoration combinations
const decorations = ['bold', 'italic', 'underline'] as const;
decorations.forEach((dec1) => {
	decorations.forEach((dec2) => {
		if (dec1 !== dec2) {
			console.log(ANSIStringFormatter.formatComplex(`${dec1} and ${dec2}`, { styles: [dec1, dec2] }));
		}
	});
});
// Output: All combinations of bold, italic, and underline

// Example 16: Rainbow text with background
console.log(
	ANSIStringFormatter.formatComplex(ANSIStringFormatter.rainbow('Rainbow on black'), { backgroundColor: 'black' }),
);
// Output: Rainbow text on a black background

// Example 17: Gradient with style
console.log(
	ANSIStringFormatter.formatWithStyle(
		ANSIStringFormatter.gradient('Styled gradient', [255, 0, 0], [0, 0, 255]),
		'bold',
	),
);
// Output: Bold text with a color gradient from red to blue

// Example 18: Complex formatting with RGB and Hex
console.log(
	ANSIStringFormatter.formatComplex('RGB and Hex', {
		rgbColor: [100, 150, 200],
		hexBackgroundColor: '#FFFF00',
		styles: ['italic', 'underline'],
	}),
);
// Output: Italic and underlined text with RGB foreground and Hex background colors

// Example 19: Using reset for specific styles
const styledText = ANSIStringFormatter.formatComplex('Styled text', { color: 'red', styles: ['bold', 'underline'] });
console.log(`${styledText}${ANSIStringFormatter.reset('bold')} Not bold but still red and underlined`);
// Output: Bold, red, underlined text followed by not bold but still red and underlined text

// Example 20: Creating a temperature gradient
const tempGradient = (temp: number) => {
	const scale = (temp + 20) / 60; // Assuming temperature range from -20°C to 40°C
	const r = Math.round(255 * Math.min(1, 2 * scale)) as ValidRGBColor;
	const b = Math.round(255 * Math.min(1, 2 * (1 - scale))) as ValidRGBColor;
	return ANSIStringFormatter.formatWithRGB(`${temp}°C`, [r, 0, b]);
};

for (let temp = -20; temp <= 40; temp += 5) {
	console.log(tempGradient(temp));
}
// Output: Temperature scale from -20°C to 40°C with color gradient from blue (cold) to red (hot)

// Example 1: Create a colorful progress bar
function createProgressBar(progress: number, width: number): string {
	const filledWidth = Math.round(progress * width);
	const emptyWidth = width - filledWidth;

	const filledPart = ANSIStringFormatter.gradient('■'.repeat(filledWidth), [0, 255, 0], [255, 255, 0]);
	const emptyPart = ANSIStringFormatter.formatWithColor('□'.repeat(emptyWidth), 'darkGray');
	const percentage = ANSIStringFormatter.formatWithColor(` ${Math.round(progress * 100)}%`, 'cyan');

	return `[${filledPart}${emptyPart}]${percentage}`;
}

console.log(createProgressBar(0.6, 20));
// Output: A progress bar with gradient-filled part, gray empty part, and cyan percentage

// Example 2: Create a rainbow-styled log level indicator
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

function logWithLevel(level: LogLevel, message: string): string {
	const levelColors: Record<LogLevel, ANSIColor> = {
		DEBUG: 'cyan',
		INFO: 'green',
		WARN: 'yellow',
		ERROR: 'red',
		FATAL: 'magenta',
	};

	const timestamp = new Date().toISOString();
	const coloredLevel = ANSIStringFormatter.formatWithColor(level.padEnd(5), levelColors[level]);
	const rainbowMessage = ANSIStringFormatter.rainbow(message);

	return `${ANSIStringFormatter.formatWithColor(timestamp, 'darkGray')} [${coloredLevel}] ${rainbowMessage}`;
}

console.log(logWithLevel('INFO', 'Application started successfully'));
console.log(logWithLevel('ERROR', 'Failed to connect to database'));
// Output: Colorful log messages with timestamp, colored log level, and rainbow message

// Example 3: Create a color-coded temperature display
function temperatureDisplay(temp: number): string {
	const celsiusColor = (temp: number): RGBColor => {
		const r = Math.min(255, Math.max(0, Math.round((temp + 20) * 5.1))) as ValidRGBColor;
		const b = Math.min(255, Math.max(0, Math.round((40 - temp) * 5.1))) as ValidRGBColor;
		return [r, 0, b];
	};

	const fahrenheit = (temp * 9) / 5 + 32;
	const tempC = ANSIStringFormatter.formatWithRGB(`${temp.toFixed(1)}°C`, celsiusColor(temp));
	const tempF = ANSIStringFormatter.formatWithRGB(`${fahrenheit.toFixed(1)}°F`, celsiusColor(temp));

	let description: string;
	if (temp < 0) description = ANSIStringFormatter.formatWithColor('Freezing', 'cyan');
	else if (temp < 10) description = ANSIStringFormatter.formatWithColor('Cold', 'blue');
	else if (temp < 20) description = ANSIStringFormatter.formatWithColor('Cool', 'green');
	else if (temp < 30) description = ANSIStringFormatter.formatWithColor('Warm', 'yellow');
	else description = ANSIStringFormatter.formatWithColor('Hot', 'red');

	return `Temperature: ${tempC} / ${tempF} - ${description}`;
}

console.log(temperatureDisplay(-5));
console.log(temperatureDisplay(15));
console.log(temperatureDisplay(35));
// Output: Color-coded temperature displays with Celsius, Fahrenheit, and description

// Example 4: Create a styled data table
function createDataTable(data: Array<Record<string, string | number>>): string {
	if (data.length === 0) return 'No data';

	const headers = Object.keys(data[0]);
	const columnWidths = headers.map((header) =>
		Math.max(header.length, ...data.map((row) => String(row[header]).length)),
	);

	const createRow = (rowData: Record<string, string | number>, isHeader: boolean = false) => {
		return headers
			.map((header, index) => {
				const value = String(rowData[header]).padEnd(columnWidths[index]);
				return isHeader ?
						ANSIStringFormatter.formatComplex(value, { color: 'white', backgroundColor: 'blue', styles: ['bold'] })
					:	ANSIStringFormatter.formatWithColor(value, index % 2 === 0 ? 'cyan' : 'green');
			})
			.join(' | ');
	};

	const headerRow = createRow(Object.fromEntries(headers.map((h) => [h, h])), true);
	const dataRows = data.map((row) => createRow(row));
	const separator = ANSIStringFormatter.formatWithColor(
		'+' + columnWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+',
		'yellow',
	);

	return [separator, headerRow, separator, ...dataRows, separator].join('\n');
}

const sampleData = [
	{ name: 'Alice', age: 30, city: 'New York' },
	{ name: 'Bob', age: 25, city: 'Los Angeles' },
	{ name: 'Charlie', age: 35, city: 'Chicago' },
];

console.log(createDataTable(sampleData));
// Output: A styled data table with colored headers and alternating row colors

// Example 5: Create an interactive menu
function createInteractiveMenu(options: string[]): string {
	return options
		.map((option, index) => {
			const number = ANSIStringFormatter.formatComplex(`[${index + 1}]`, { color: 'yellow', styles: ['bold'] });
			const text =
				index === 0 ?
					ANSIStringFormatter.formatComplex(option, { color: 'green', styles: ['bold', 'underline'] })
				:	ANSIStringFormatter.formatWithColor(option, 'white');
			return `${number} ${text}`;
		})
		.join('\n');
}

const menuOptions = ['Start Game', 'Options', 'High Scores', 'Exit'];
console.log(ANSIStringFormatter.formatWithColor('=== Main Menu ===', 'magenta'));
console.log(createInteractiveMenu(menuOptions));
// Output: An interactive menu with colored and styled options

// Example 6: Create a color palette showcase
function createColorPalette(): string {
	const colors: ANSIColor[] = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
	const colorBlocks = colors.map((color) =>
		ANSIStringFormatter.formatComplex(`  ${color.padEnd(8)}  `, { color: 'black', backgroundColor: color }),
	);

	const brightColors = colors.map((color) => `bright${color.charAt(0).toUpperCase() + color.slice(1)}` as ANSIColor);
	const brightColorBlocks = brightColors.map((color) =>
		ANSIStringFormatter.formatComplex(`  ${color.slice(6).padEnd(8)}  `, { color: 'black', backgroundColor: color }),
	);

	return [
		ANSIStringFormatter.formatWithStyle('Standard Colors:', 'bold'),
		colorBlocks.join(' '),
		'',
		ANSIStringFormatter.formatWithStyle('Bright Colors:', 'bold'),
		brightColorBlocks.join(' '),
	].join('\n');
}

console.log(createColorPalette());
// Output: A showcase of all available colors in the ANSIStringFormatter

// Example 7: Create a styled file tree
function createFileTree(tree: Record<string, any>, indent: number = 0): string {
	let output = '';
	Object.entries(tree).forEach(([key, value], index, array) => {
		const isLast = index === array.length - 1;
		const prefix =
			indent === 0 ? ''
			: isLast ? '└── '
			: '├── ';
		const indentation = ' '.repeat(indent * 4);

		if (typeof value === 'object') {
			output += ANSIStringFormatter.formatComplex(`${indentation}${prefix}${key}/\n`, {
				color: 'blue',
				styles: ['bold'],
			});
			output += createFileTree(value, indent + 1);
		} else {
			let fileColor: ANSIColor = 'white';
			if (key.endsWith('.js')) fileColor = 'yellow';
			else if (key.endsWith('.ts')) fileColor = 'cyan';
			else if (key.endsWith('.json')) fileColor = 'green';

			output += ANSIStringFormatter.formatWithColor(`${indentation}${prefix}${key}\n`, fileColor);
		}
	});
	return output;
}

const fileStructure = {
	'src': {
		'components': {
			'Header.tsx': null,
			'Footer.tsx': null,
		},
		'utils': {
			'helpers.ts': null,
			'constants.ts': null,
		},
		'index.ts': null,
	},
	'package.json': null,
	'tsconfig.json': null,
	'README.md': null,
};

console.log(createFileTree(fileStructure));
// Output: A colorful representation of a file tree structure

// Example 8: Create a loading spinner
function createLoadingSpinner(frames: number): () => string {
	const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	let currentFrame = 0;

	return () => {
		const char = spinnerChars[currentFrame];
		currentFrame = (currentFrame + 1) % spinnerChars.length;
		return ANSIStringFormatter.gradient(char, [255, 0, 0], [0, 0, 255]);
	};
}

const getNextSpinnerFrame = createLoadingSpinner(10);
console.log('Loading: ' + getNextSpinnerFrame()); // Call this in a loop or interval for animation
// Output: A gradient-colored loading spinner character
