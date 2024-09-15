import React from 'react';
import { render } from '@testing-library/react';
import {
	QueryClient,
	QueryClientProvider,
	QueryKey,
	UseQueryResult,
	UseMutationResult,
	QueryObserverResult,
} from '@tanstack/react-query';
import { vi } from 'vitest';
import { act } from 'react';

export const createReactQueryTestUtils = (queryClient: QueryClient) => {
	const createQueryClientWrapper = () => {
		return ({ children }: React.PropsWithChildren) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};

	const renderWithReactQuery = (ui: React.ReactElement) => {
		const Wrapper = createQueryClientWrapper();
		return render(ui, { wrapper: Wrapper });
	};

	const createMockQueryResult = <TData, TError>(overrides: Partial<UseQueryResult<TData, TError>> = {}) => {
		return {
			data: undefined,
			error: null,
			isError: false,
			isLoading: false,
			isSuccess: true,
			status: 'success',
			...overrides,
		} as UseQueryResult<TData, TError>;
	};

	const mockUseQuery = <TData, TError>(mockResult: Partial<UseQueryResult<TData, TError>> = {}) => {
		const useQueryMock = vi.fn(() => createMockQueryResult<TData, TError>(mockResult));
		vi.mock('@tanstack/react-query', async (importOriginal) => {
			const original = await importOriginal<typeof import('@tanstack/react-query')>();
			return {
				...original,
				useQuery: useQueryMock,
			};
		});
		return useQueryMock;
	};

	const createMockMutationResult = <TData, TError, TVariables, TContext>(
		overrides: Partial<UseMutationResult<TData, TError, TVariables, TContext>> = {},
	) => {
		return {
			data: undefined,
			error: null,
			isError: false,
			isIdle: true,
			isSuccess: false,
			status: 'idle',
			mutate: vi.fn(),
			mutateAsync: vi.fn(),
			reset: vi.fn(),
			...overrides,
		} as UseMutationResult<TData, TError, TVariables, TContext>;
	};

	const mockUseMutation = <TData, TError, TVariables, TContext>(
		mockResult: Partial<UseMutationResult<TData, TError, TVariables, TContext>> = {},
	) => {
		const useMutationMock = vi.fn(() => createMockMutationResult<TData, TError, TVariables, TContext>(mockResult));
		vi.mock('@tanstack/react-query', async (importOriginal) => {
			const original = await importOriginal<typeof import('@tanstack/react-query')>();
			return {
				...original,
				useMutation: useMutationMock,
			};
		});
		return useMutationMock;
	};

	const waitForQueries = async () => {
		await vi.runAllTimersAsync();
		await queryClient.isFetching();
	};

	const prefetchQuery = (queryKey: QueryKey, queryFn: <TData>() => Promise<TData>) => {
		return queryClient.prefetchQuery({ queryKey, queryFn });
	};

	const clearQueryCache = () => {
		queryClient.clear();
	};

	const createMockQueryObserver = <TData, TError>(initialResult: QueryObserverResult<TData, TError>) => {
		let listeners: Array<() => void> = [];
		let currentResult = initialResult;

		return {
			subscribe: vi.fn((listener: () => void) => {
				listeners.push(listener);
				listener(); // Call immediately
				return () => {
					listeners = listeners.filter((l) => l !== listener);
				};
			}),
			getCurrentResult: vi.fn(() => currentResult),
			setResult: (newResult: QueryObserverResult<TData, TError>) => {
				currentResult = newResult;
				listeners.forEach((listener) => listener());
			},
		};
	};

	const matchesQueryKey = (givenKey: QueryKey, expectedKey: QueryKey) => {
		if (givenKey.length !== expectedKey.length) return false;
		return givenKey.every((part, index) => part === expectedKey[index]);
	};

	const waitForQueryToSettle = async () => {
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	};

	const renderWithAsyncQuery = async (ui: React.ReactElement) => {
		const result = renderWithReactQuery(ui);
		await waitForQueryToSettle();
		return result;
	};

	return {
		renderWithReactQuery,
		renderWithAsyncQuery,
		createMockQueryResult,
		mockUseQuery,
		createMockMutationResult,
		mockUseMutation,
		waitForQueries,
		waitForQueryToSettle,
		prefetchQuery,
		clearQueryCache,
		createMockQueryObserver,
		matchesQueryKey,
	};
};
