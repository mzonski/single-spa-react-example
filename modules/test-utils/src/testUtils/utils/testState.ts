interface TestState {
	[key: string]: any;
}

interface TestStateActions {
	setState: (key: string, value: any) => void;
	getState: <T>(key: string) => T;
	clearState: () => void;
	setup: () => void;
}

export const createTestStateHandler = (): TestStateActions => {
	let state: TestState = {};

	const setState = (key: string, value: any) => {
		state[key] = value;
	};

	const getState = <T>(key: string) => {
		return state[key] as T;
	};

	const clearState = () => {
		state = {};
	};

	const setup = () => {
		beforeEach(() => {
			clearState();
		});
	};

	return {
		setState,
		getState,
		clearState,
		setup,
	};
};

export const globalTestState = createTestStateHandler();
