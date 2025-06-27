import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	NodeApiError,
} from 'n8n-workflow';

// Cache for JWT tokens to avoid repeated logins
const tokenCache = new Map<string, { token: string; expires: number }>();

/**
 * Login to AnyWebsites and get JWT token
 */
async function getJWTToken(
	context: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	credentials: any,
): Promise<string> {
	const cacheKey = `${credentials.baseUrl}:${credentials.username}`;
	const cached = tokenCache.get(cacheKey);

	// Check if we have a valid cached token (expires in 1 hour, check 5 minutes early)
	if (cached && cached.expires > Date.now() + 5 * 60 * 1000) {
		return cached.token;
	}

	// Login to get new token
	const loginOptions: IHttpRequestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			username: credentials.username,
			password: credentials.password,
		},
		url: `${credentials.baseUrl}/api/auth/login`,
		json: true,
		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
	};

	try {
		const response = await context.helpers.httpRequest(loginOptions);

		if (!response.access_token) {
			throw new Error('Login failed: No access token received');
		}

		// Cache the token (assume 1 hour expiry)
		tokenCache.set(cacheKey, {
			token: response.access_token,
			expires: Date.now() + 60 * 60 * 1000, // 1 hour
		});

		return response.access_token;
	} catch (error) {
		throw new NodeApiError(context.getNode(), error as any, {
			message: 'Login failed. Please check your username and password.',
		});
	}
}

/**
 * Make an API request to AnyWebsites
 */
export async function anyWebsitesApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	qs: any = {},
): Promise<any> {
	const credentials = await this.getCredentials('anyWebsitesApi');

	// Get JWT token
	const token = await getJWTToken(this, credentials);

	const options: IHttpRequestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		body,
		qs,
		url: `${credentials.baseUrl}${endpoint}`,
		json: true,
		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
	};

	// Remove empty body for GET and DELETE requests
	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequest(options);
	} catch (error) {
		// If we get 401, clear the cached token and try once more
		if ((error as any).response?.status === 401) {
			const cacheKey = `${credentials.baseUrl}:${credentials.username}`;
			tokenCache.delete(cacheKey);

			// Try once more with fresh token
			const newToken = await getJWTToken(this, credentials);
			options.headers!['Authorization'] = `Bearer ${newToken}`;

			try {
				return await this.helpers.httpRequest(options);
			} catch (retryError) {
				throw new NodeApiError(this.getNode(), retryError as any);
			}
		}

		throw new NodeApiError(this.getNode(), error as any);
	}
}

/**
 * Make an API request to AnyWebsites and return all results
 * by handling pagination automatically
 */
export async function anyWebsitesApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	qs: any = {},
): Promise<any[]> {
	const returnData: any[] = [];

	let responseData;
	qs.page = 1;
	qs.limit = qs.limit || 100;

	do {
		responseData = await anyWebsitesApiRequest.call(this, method, endpoint, body, qs);
		
		if (responseData.contents) {
			returnData.push.apply(returnData, responseData.contents);
		} else if (Array.isArray(responseData)) {
			returnData.push.apply(returnData, responseData);
		} else {
			returnData.push(responseData);
		}

		qs.page++;
	} while (
		responseData.contents &&
		responseData.contents.length === qs.limit
	);

	return returnData;
}
