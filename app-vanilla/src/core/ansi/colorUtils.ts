import { RGBColor } from './types';

const isValidHexColor = (hex: string) => /^#?([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6})$/.test(hex);

const expandHex = (hex: string) =>
	hex.length === 3 || hex.length === 4 ?
		hex
			.split('')
			.map((char) => char + char)
			.join('')
	:	hex;

const parseHexSegment = (hex: string, start: number, end: number) => parseInt(hex.slice(start, end), 16);

export function hexToRgb(hex: string): RGBColor {
	if (!isValidHexColor(hex)) {
		throw new Error('Invalid hex color format');
	}

	const normalizedHex = expandHex(hex.replace('#', ''));

	const r = parseHexSegment(normalizedHex, 0, 2);
	const g = parseHexSegment(normalizedHex, 2, 4);
	const b = parseHexSegment(normalizedHex, 4, 6);

	return [r, g, b] as RGBColor;
}

function convertNumberToHex(num: number) {
	return num.toString(16).padStart(2, '0');
}

export function rgbToHex(rgb: RGBColor): string {
	return '#' + rgb.map(convertNumberToHex).join('');
}
