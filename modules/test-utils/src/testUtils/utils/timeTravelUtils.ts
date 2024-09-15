import { vi } from 'vitest';

export const timeTravel = (dateToTravelTo: Date | number, callback: () => Promise<void>) => {
	const realDate = Date;
	const realNow = Date.now;
	const realSetTimeout = global.setTimeout;
	const realSetInterval = global.setInterval;

	const mockDate = class extends Date {
		constructor(...args: ConstructorParameters<typeof Date>) {
			super(...args);
			if (Object.keys(args).length === 0) {
				return new realDate(dateToTravelTo);
			}
			return new realDate(...args);
		}

		static now() {
			return new realDate(dateToTravelTo).getTime();
		}
	};

	global.Date = mockDate as unknown as DateConstructor;
	global.Date.now = mockDate.now;

	const baseTime = new Date(dateToTravelTo).getTime();
	vi.useFakeTimers();
	vi.setSystemTime(baseTime);

	return callback().finally(() => {
		global.Date = realDate;
		global.Date.now = realNow;
		global.setTimeout = realSetTimeout;
		global.setInterval = realSetInterval;
		vi.useRealTimers();
	});
};
