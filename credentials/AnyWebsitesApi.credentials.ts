import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AnyWebsitesApi implements ICredentialType {
	name = 'anyWebsitesApi';
	displayName = 'AnyWebsites API';
	documentationUrl = 'https://anywebsites.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://localhost:8443',
			placeholder: 'https://your-anywebsites-instance.com',
			description: 'The base URL of your AnyWebsites instance',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'ak_1234567890abcdef',
			description: 'Your AnyWebsites API key. You can find this in your user settings.',
			required: true,
		},
	];

	// Use API key authentication
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Test the credentials
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/health',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'Authentication test successful',
					key: 'status',
					value: 'ok',
				},
			},
		],
	};
}
