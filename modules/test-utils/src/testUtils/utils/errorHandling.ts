export class ElementNotFoundError extends Error {
	constructor(selector: string | RegExp) {
		super(`Element with selector "${selector}" not found`);
		this.name = 'ElementNotFoundError';
	}
}

export class TimeoutError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TimeoutError';
	}
}
