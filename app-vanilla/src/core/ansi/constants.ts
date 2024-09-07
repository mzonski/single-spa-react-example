import { ANSIColor, ANSIStyle, SupportedANSIBackgroundColor, SupportedANSIColor, SupportedANSIStyle } from './types';

export const ANSIColors = [
	'black',
	'red',
	'green',
	'yellow',
	'blue',
	'magenta',
	'cyan',
	'lightGray',
	'darkGray',
	'lightRed',
	'lightGreen',
	'lightYellow',
	'lightBlue',
	'lightMagenta',
	'lightCyan',
	'white',
] as const;

export const ANSIStyles = ['reset', 'bold', 'lighter', 'italic', 'underline', 'lineThrough', 'overline'] as const;

export const ANSIColorsMap = {
	color: {
		black: 30,
		red: 31,
		green: 32,
		yellow: 33,
		blue: 34,
		magenta: 35,
		cyan: 36,
		lightGray: 37,
		darkGray: 90,
		lightRed: 91,
		lightGreen: 92,
		lightYellow: 93,
		lightBlue: 94,
		lightMagenta: 95,
		lightCyan: 96,
		white: 97,
	},
	background: {
		black: 40,
		red: 41,
		green: 42,
		yellow: 43,
		blue: 44,
		magenta: 45,
		cyan: 46,
		lightGray: 47,
		darkGray: 100,
		lightRed: 101,
		lightGreen: 102,
		lightYellow: 103,
		lightBlue: 104,
		lightMagenta: 105,
		lightCyan: 106,
		white: 107,
	},
} as const satisfies {
	color: Record<ANSIColor, SupportedANSIColor>;
	background: Record<ANSIColor, SupportedANSIBackgroundColor>;
};
export const ANSIStylesMap = {
	style: {
		reset: 0,
		bold: 1,
		lighter: 2,
		italic: 3,
		underline: 4,
		lineThrough: 9,
		overline: 53,
	},
	reset: {
		reset: 0,
		bold: 22,
		lighter: 22,
		italic: 23,
		underline: 24,
		lineThrough: 29,
		overline: 55,
	},
} as const satisfies {
	style: Record<ANSIStyle, SupportedANSIStyle>;
	reset: Record<ANSIStyle, SupportedANSIStyle>;
};
