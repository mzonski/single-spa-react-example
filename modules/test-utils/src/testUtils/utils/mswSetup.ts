import { setupServer } from 'msw/node';
import { http, HttpResponse, RequestHandler } from 'msw';

export const createMswServer = (handlers: RequestHandler[] = []) => {
	const server = setupServer(...handlers);

	beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	return server;
};

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export const createApiMock = (method: HttpMethod) => {
	return (path: string, response: any, status = 200) => {
		return http[method](path, () => {
			return HttpResponse.json(response, { status });
		});
	};
};

export const mockGet = createApiMock('get');
export const mockPost = createApiMock('post');
export const mockPut = createApiMock('put');
export const mockDelete = createApiMock('delete');
export const mockPatch = createApiMock('patch');
