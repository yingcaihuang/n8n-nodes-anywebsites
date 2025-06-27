import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	NodeApiError,
} from 'n8n-workflow';

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

	const options: IHttpRequestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': credentials.apiKey as string,
		},
		body,
		qs,
		url: `${credentials.baseUrl}${endpoint}`,
		json: true,
	};

	// Remove empty body for GET and DELETE requests
	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}

	try {
		return await this.helpers.httpRequest(options);
	} catch (error) {
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
