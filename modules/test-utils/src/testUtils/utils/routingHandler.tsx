import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';

interface RoutingHandlerOptions {
	initialEntries?: string[];
	initialIndex?: number;
}

interface RoutingActions {
	navigate: (to: string) => void;
	goBack: () => void;
	goForward: () => void;
	getCurrentPath: () => string;
	getHistory: () => MemoryHistory;
	renderWithRouter: (ui: React.ReactElement, routes?: React.ReactElement[]) => void;
	waitForRouteChange: (expectedPath: string) => Promise<void>;
	expectRedirect: (fromPath: string, toPath: string) => Promise<void>;
	expectRouteAccess: (path: string, shouldHaveAccess: boolean) => Promise<void>;
}

export const createRoutingHandler = (options: RoutingHandlerOptions = {}): RoutingActions => {
	const { initialEntries = ['/'], initialIndex = 0 } = options;

	const history = createMemoryHistory({ initialEntries, initialIndex });

	const navigate = (to: string) => {
		history.push(to);
	};

	const goBack = () => {
		history.back();
	};

	const goForward = () => {
		history.forward();
	};

	const getCurrentPath = () => {
		return history.location.pathname;
	};

	const getHistory = () => {
		return history;
	};

	const renderWithRouter = (ui: React.ReactElement, routes: React.ReactElement[] = []) => {
		render(
			<MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
				<Routes>
					{routes}
					<Route path="*" element={ui} />
				</Routes>
			</MemoryRouter>,
		);
	};

	const waitForRouteChange = async (expectedPath: string) => {
		await waitFor(() => {
			expect(getCurrentPath()).toBe(expectedPath);
		});
	};

	const expectRedirect = async (fromPath: string, toPath: string) => {
		navigate(fromPath);
		await waitForRouteChange(toPath);
	};

	const expectRouteAccess = async (path: string, shouldHaveAccess: boolean) => {
		navigate(path);
		await waitFor(() => {
			if (shouldHaveAccess) {
				expect(getCurrentPath()).toBe(path);
			} else {
				expect(getCurrentPath()).not.toBe(path);
			}
		});
	};

	return {
		navigate,
		goBack,
		goForward,
		getCurrentPath,
		getHistory,
		renderWithRouter,
		waitForRouteChange,
		expectRedirect,
		expectRouteAccess,
	};
};
