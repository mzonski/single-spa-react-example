import { ANSIColors, ANSIStyles } from './constants';
import { IntRange, TupleToUnion } from '../../utilityTypes';

export type SupportedANSIStyle = 0 | 1 | 2 | 3 | 4 | 9 | 22 | 23 | 24 | 29 | 39 | 49 | 53 | 55;
export type SupportedANSIColor = 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97;
export type SupportedANSIBackgroundColor =
	| 40
	| 41
	| 42
	| 43
	| 44
	| 45
	| 46
	| 47
	| 100
	| 101
	| 102
	| 103
	| 104
	| 105
	| 106
	| 107;
export type ANSIStyle = TupleToUnion<typeof ANSIStyles>;
export type ANSIColorType = 'color' | 'background';
export type ANSIColor = TupleToUnion<typeof ANSIColors>;
export type ANSIStyleType = 'style' | 'reset';
export type ValidRGBColor = IntRange<0, 256>;
export type RGBColor = [ValidRGBColor, ValidRGBColor, ValidRGBColor];

export type ANSIFormattingOptions = {
	color?: ANSIColor;
	backgroundColor?: ANSIColor;
	rgbColor?: RGBColor;
	rgbBackgroundColor?: RGBColor;
	hexColor?: string;
	hexBackgroundColor?: string;
	styles?: ANSIStyle[];
};
