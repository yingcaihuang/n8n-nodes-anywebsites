import {
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
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'your_username',
			description: 'Your AnyWebsites username',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'your_password',
			description: 'Your AnyWebsites password',
			required: true,
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: true,
			description: 'Whether to ignore SSL certificate errors. Enable this for self-signed certificates or development environments.',
		},
	];

	// No authentication here - will be handled in GenericFunctions

	// Test the credentials by attempting login
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/auth/login',
			method: 'POST',
			body: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
			skipSslCertificateValidation: '={{$credentials.allowUnauthorizedCerts}}',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 200,
					message: 'Login successful',
				},
			},
		],
	};
}
