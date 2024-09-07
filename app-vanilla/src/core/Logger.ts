import type { TupleToUnion } from '../utilityTypes';
import type { ANSIColor, ANSIStyle } from './ansi/types';
import debug from 'debug';
import formatter from './ansi/ANSIStringFormatter';

const LogLevels = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = TupleToUnion<typeof LogLevels>;

type LogStyle = {
	color?: ANSIColor;
	background?: ANSIColor;
	styles?: ANSIStyle[];
};

type LoggerOptions = {
	enabled: boolean;
	logLevel: LogLevel;
	styles?: Record<LogLevel, LogStyle>;
};

const defaultStyles: Record<LogLevel, LogStyle> = {
	debug: { color: 'darkGray' },
	info: { color: 'blue' },
	warn: { color: 'yellow', styles: ['bold'] },
	error: { color: 'red', styles: ['bold', 'underline'] },
};

const priorities: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

const defaultOptions: LoggerOptions = {
	enabled: true,
	logLevel: 'debug',
	styles: defaultStyles,
};

debug.log = console.log.bind(console);

export class Logger {
	readonly #namespace: string;
	// readonly #debugInstances: Record<LogLevel, debug.Debugger>;
	readonly #debugger: debug.Debugger;
	readonly #styles?: Record<LogLevel, LogStyle>;
	readonly #minLevel: LogLevel = 'debug';

	constructor(namespace: string, options: LoggerOptions = defaultOptions) {
		this.#namespace = namespace;
		// const { baseInstance, debugInstances } = Logger.#createLoggerInstances(namespace);
		this.#debugger = debug(namespace);
		this.#styles = options.styles;
		this.#minLevel = options.logLevel;

		if (options.enabled) {
			debug.enable(`${namespace}:*`);
		}
	}

	// static #createLoggerInstances(namespace: string) {
	// 	const baseInstance = debug(namespace);
	// 	const debugInstances = LogLevels.reduce(
	// 		(obj, level) => {
	// 			obj[level] = baseInstance.extend(`${level}`);
	// 			obj[level].color = defaultStyles[level]['color'];
	// 			return obj;
	// 		},
	// 		{} as Record<LogLevel, debug.Debugger>,
	// 	);
	// 	return { baseInstance, debugInstances };
	// }

	setEnabled(levels: LogLevel[] | '*' | null, enabled: boolean) {
		const currentEnabled = debug.disable();
		if (levels === '*') {
			debug.enable(enabled ? `${this.#namespace}:*` : '-*');
		} else if (Array.isArray(levels)) {
			const newEnabled = levels.map((level) => `${this.#namespace}:${level}`).join(',');
			debug.enable(enabled ? `${currentEnabled},${newEnabled}` : `-${newEnabled}`);
		} else if (levels === null && !enabled) {
			debug.disable();
		}
	}

	debug(message: string, ...args: unknown[]): void {
		this.#log('debug', message, ...args);
	}

	info(message: string, ...args: unknown[]): void {
		this.#log('info', message, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		this.#log('warn', message, ...args);
	}

	error(message: string, error?: Error | unknown, ...args: unknown[]): void {
		if (error instanceof Error) {
			this.#log('error', `${message}\n%O`, error, ...args);
		} else {
			this.#log('error', message, error, ...args);
		}
	}

	log(level: LogLevel, message: string, ...args: unknown[]) {}

	#log(level: LogLevel, message: string, ...args: unknown[]): void {
		if (this.#getLevelPriority(level) < this.#getLevelPriority(this.#minLevel)) return;
		const formattedLevel = this.#formatLevel(level);
		// const formattedMessage = this.#formatMessage(level, `${message}`);
		this.#debugger(`${formattedLevel} ${message}`, ...args);
	}

	#getLevelPriority(level: LogLevel): number {
		return priorities[level];
	}

	#formatLevel(level: LogLevel): string {
		return formatter.formatComplex(`[${level.toUpperCase()}]`, this.#styles?.[level] ?? {});
	}
}
