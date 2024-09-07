import { ANSIColorsMap, ANSIStylesMap } from './constants';
import {
	ANSIColor,
	ANSIColorType,
	ANSIStyle,
	ANSIStyleType,
	RGBColor,
	ANSIFormattingOptions,
	ValidRGBColor,
} from './types';
import { hexToRgb } from './colorUtils';

export default class ANSIStringFormatter {
	static #getANSIColor<T extends ANSIColorType, C extends ANSIColor>(type: T, color: C): number {
		return ANSIColorsMap[type][color];
	}

	static #getANSIStyle<T extends ANSIStyleType, S extends ANSIStyle>(type: T, style: S): number {
		return ANSIStylesMap[type][style];
	}

	static #resetANSIColorCode(type: ANSIColorType): number {
		return type === 'color' ? 39 : 49;
	}

	static #createANSIRGBCode(type: ANSIColorType, color: RGBColor): string {
		const prefix = type === 'color' ? 38 : 48;
		const [r, g, b] = color;
		return `${prefix};2;${r};${g};${b}`;
	}

	public static wrapWithANSI(text: string, ...codes: (string | number)[]): string {
		return `\x1b[${codes.join(';')}m${text}\x1b[0m`;
	}

	public static formatWithColor(text: string, color: ANSIColor, type: ANSIColorType = 'color'): string {
		return this.wrapWithANSI(text, this.#getANSIColor(type, color));
	}

	public static formatWithRGB(text: string, color: RGBColor, type: ANSIColorType = 'color'): string {
		return this.wrapWithANSI(text, this.#createANSIRGBCode(type, color));
	}

	public static formatWithHex(text: string, hexColor: string, type: ANSIColorType = 'color'): string {
		const rgbColor = hexToRgb(hexColor);
		return this.formatWithRGB(text, rgbColor, type);
	}

	public static formatWithStyle(text: string, style: ANSIStyle): string {
		return this.wrapWithANSI(text, this.#getANSIStyle('style', style));
	}

	public static formatComplex(text: string, options: ANSIFormattingOptions): string {
		const codes: (string | number)[] = [];

		if (options.color) codes.push(this.#getANSIColor('color', options.color));
		if (options.backgroundColor) codes.push(this.#getANSIColor('background', options.backgroundColor));
		if (options.rgbColor) codes.push(this.#createANSIRGBCode('color', options.rgbColor));
		if (options.rgbBackgroundColor) codes.push(this.#createANSIRGBCode('background', options.rgbBackgroundColor));
		if (options.hexColor) codes.push(this.#createANSIRGBCode('color', hexToRgb(options.hexColor)));
		if (options.hexBackgroundColor)
			codes.push(this.#createANSIRGBCode('background', hexToRgb(options.hexBackgroundColor)));
		if (options.styles) options.styles.forEach((style) => codes.push(this.#getANSIStyle('style', style)));

		return this.wrapWithANSI(text, ...codes);
	}

	public static reset(type?: ANSIColorType | ANSIStyle): string {
		if (type === 'color' || type === 'background') {
			return `\x1b[${this.#resetANSIColorCode(type)}m`;
		} else if (type) {
			return `\x1b[${this.#getANSIStyle('reset', type)}m`;
		}
		return '\x1b[0m';
	}

	public static rainbow(text: string): string {
		const colors: ANSIColor[] = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
		return text
			.split('')
			.map((char, index) => this.formatWithColor(char, colors[index % colors.length]))
			.join('');
	}

	public static gradient(text: string, startColor: RGBColor, endColor: RGBColor): string {
		const steps = text.length;
		return text
			.split('')
			.map((char, index) => {
				const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (index / (steps - 1))) as ValidRGBColor;
				const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (index / (steps - 1))) as ValidRGBColor;
				const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (index / (steps - 1))) as ValidRGBColor;
				return this.formatWithRGB(char, [r, g, b]);
			})
			.join('');
	}
}
