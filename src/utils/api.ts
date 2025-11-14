import ky, { KyInstance } from 'ky';

// In dev mode, use relative URL to go through Vite proxy
// In production, use the actual API URL
export const API_BASE_URL = import.meta.env.DEV 
	? '' 
	: (import.meta.env.VITE_API_BASE_URL as string) || '/';

let globalHeaders: Record<string, string> = {};

export const api: KyInstance = ky.create({
	prefixUrl: import.meta.env.DEV ? '/api/v1' : `${API_BASE_URL}/api/v1`,
	hooks: {
		beforeRequest: [
			(request) => {
				Object.entries(globalHeaders).forEach(([key, value]) => {
					request.headers.set(key, value);
				});
			}
		]
	},
	retry: {
		limit: 2,
		methods: ['get', 'put', 'head', 'delete', 'options', 'trace']
	}
});

export const setGlobalHeaders = (headers: Record<string, string>) => {
	globalHeaders = { ...globalHeaders, ...headers };
};

export const removeGlobalHeaders = (headerKeys: string[]) => {
	headerKeys.forEach((key) => {
		delete globalHeaders[key];
	});
};

export const getGlobalHeaders = () => {
	return globalHeaders;
};

export default api;
