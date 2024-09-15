import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ElementNotFoundError, TimeoutError } from './errorHandling';
import { getCachedElement } from './performanceOptimizations';

interface ElementActions {
	getElement: <T extends HTMLInputElement>() => T;
	triggerClick: () => void;
	triggerChange: (inputValue: string) => void;
	getValue: () => string;
	isDisabled: () => boolean;
	waitToBeVisible: () => Promise<void>;
	waitToBeEnabled: () => Promise<void>;
	waitToHaveValue: (expectedValue: string) => Promise<void>;
	waitToExist: (timeout?: number) => Promise<void>;
	waitToDisappear: (timeout?: number) => Promise<void>;
}

export const createElementHandler = (selector: string | RegExp): ElementActions => {
	const findElement = <T extends HTMLElement>(replace?: boolean) => {
		try {
			return getCachedElement(selector, replace) as T;
		} catch (error) {
			throw new ElementNotFoundError(selector);
		}
	};

	const waitToBeVisible = async () => {
		await waitFor(() => {
			expect(findElement()).toBeVisible();
		});
	};

	const waitToBeEnabled = async () => {
		await waitFor(() => {
			expect(findElement()).not.toBeDisabled();
		});
	};

	const waitToHaveValue = async (expectedValue: string) => {
		await waitFor(() => {
			expect(findElement()).toHaveValue(expectedValue);
		});
	};

	const waitToExist = async (timeout = 5000) => {
		try {
			await waitFor(
				() => {
					expect(findElement(true)).toBeInTheDocument();
				},
				{ timeout },
			);
		} catch (error) {
			throw new TimeoutError(`Element did not appear within ${timeout}ms`);
		}
	};

	const waitToDisappear = async (timeout = 5000) => {
		try {
			await waitFor(
				() => {
					expect(findElement(true)).not.toBeInTheDocument();
				},
				{ timeout },
			);
		} catch (error) {
			throw new TimeoutError(`Element with selector "${selector}" did not disappear within ${timeout}ms`);
		}
	};

	return {
		getElement: findElement,
		triggerClick: () => fireEvent.click(findElement()),
		triggerChange: (inputValue: string) => fireEvent.change(findElement(), { target: { value: inputValue } }),
		getValue: () => (findElement() as HTMLInputElement).value,
		isDisabled: () => (findElement() as HTMLInputElement).disabled,
		waitToBeVisible,
		waitToBeEnabled,
		waitToHaveValue,
		waitToExist,
		waitToDisappear,
	};
};

interface FormActions {
	submitForm: () => void;
	resetForm: () => void;
	fillAndSubmit: (fieldValues: Record<string, string>) => void;
}

export const createFormHandler = (formIdentifier: string): FormActions => {
	const findForm = () => screen.getByTestId(formIdentifier) as HTMLFormElement;

	return {
		submitForm: () => fireEvent.submit(findForm()),
		resetForm: () => fireEvent.reset(findForm()),
		fillAndSubmit: (fieldValues: Record<string, string>) => {
			Object.entries(fieldValues).forEach(([fieldName, value]) => {
				const fieldHandler = createElementHandler(fieldName);
				fieldHandler.triggerChange(value);
			});
			fireEvent.submit(findForm());
		},
	};
};

interface SelectActions extends ElementActions {
	selectOption: (optionValue: string) => void;
	getSelectedOption: () => string;
}

export const createSelectHandler = (selector: string | RegExp): SelectActions => {
	const baseHandler = createElementHandler(selector);
	const findSelect = () => screen.getByTestId(selector) as HTMLSelectElement;

	return {
		...baseHandler,
		selectOption: (optionValue: string) => {
			fireEvent.change(findSelect(), { target: { value: optionValue } });
		},
		getSelectedOption: () => findSelect().value,
	};
};

interface CheckboxActions extends ElementActions {
	check: () => void;
	uncheck: () => void;
	isChecked: () => boolean;
}

export const createCheckboxHandler = (selector: string | RegExp): CheckboxActions => {
	const baseHandler = createElementHandler(selector);
	const findCheckbox = () => screen.getByTestId(selector) as HTMLInputElement;

	return {
		...baseHandler,
		check: () => {
			const checkbox = findCheckbox();
			if (!checkbox.checked) {
				fireEvent.click(checkbox);
			}
		},
		uncheck: () => {
			const checkbox = findCheckbox();
			if (checkbox.checked) {
				fireEvent.click(checkbox);
			}
		},
		isChecked: () => findCheckbox().checked,
	};
};

interface SliderActions extends ElementActions {
	slideTo: (value: number) => Promise<void>;
}

export const createSliderHandler = (selector: string | RegExp): SliderActions => {
	const baseHandler = createElementHandler(selector);

	return {
		...baseHandler,
		slideTo: async (value: number) => {
			const slider = baseHandler.getElement() as HTMLInputElement;
			await userEvent.clear(slider);
			await userEvent.type(slider, value.toString());
		},
	};
};

interface FileInputActions extends ElementActions {
	uploadFile: (file: File) => Promise<void>;
}

export const createFileInputHandler = (selector: string | RegExp): FileInputActions => {
	const baseHandler = createElementHandler(selector);

	return {
		...baseHandler,
		uploadFile: async (file: File) => {
			const input = baseHandler.getElement() as HTMLInputElement;
			await userEvent.upload(input, file);
		},
	};
};
