import { screen } from '@testing-library/react';

const elementCache = new Map<string | RegExp, Element>();

export const getCachedElement = (selector: string | RegExp, replace?: boolean) => {
	if (!elementCache.has(selector) || replace === true) {
		const element = screen.getByText(selector) || screen.getByTestId(selector);
		elementCache.set(selector, element);
	}
	return elementCache.get(selector)!;
};

export const clearElementCache = () => {
	elementCache.clear();
};
