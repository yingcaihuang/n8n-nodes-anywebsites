import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { anyWebsitesApiRequest } from './GenericFunctions';

export class AnyWebsites implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AnyWebsites',
		name: 'anyWebsites',
		icon: 'file:anywebsites.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with AnyWebsites HTML hosting service',
		defaults: {
			name: 'AnyWebsites',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'anyWebsitesApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Upload Content',
						value: 'upload',
						description: 'Upload HTML content and get published URL',
						action: 'Upload HTML content',
					},
					{
						name: 'Get Content List',
						value: 'getList',
						description: 'Get list of uploaded content',
						action: 'Get content list',
					},
					{
						name: 'Get Content',
						value: 'get',
						description: 'Get specific content details',
						action: 'Get content details',
					},
					{
						name: 'Update Content',
						value: 'update',
						description: 'Update existing content',
						action: 'Update content',
					},
					{
						name: 'Delete Content',
						value: 'delete',
						description: 'Delete content',
						action: 'Delete content',
					},
				],
				default: 'upload',
			},

			// Upload Content fields
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['upload', 'update'],
					},
				},
				default: '',
				placeholder: 'My HTML Page',
				description: 'Title for the HTML content',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['upload', 'update'],
					},
				},
				default: '',
				placeholder: 'Description of the HTML page',
				description: 'Optional description for the content',
			},
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						operation: ['upload', 'update'],
					},
				},
				default: '',
				placeholder: '<html><head><title>Hello</title></head><body><h1>Hello World!</h1></body></html>',
				description: 'The HTML content to upload',
				required: true,
			},
			{
				displayName: 'Is Public',
				name: 'isPublic',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['upload', 'update'],
					},
				},
				default: true,
				description: 'Whether the content should be publicly accessible',
			},
			{
				displayName: 'Access Code',
				name: 'accessCode',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['upload', 'update'],
						isPublic: [false],
					},
				},
				default: '',
				placeholder: 'secret123',
				description: 'Access code for private content',
			},
			{
				displayName: 'Expires At',
				name: 'expiresAt',
				type: 'dateTime',
				displayOptions: {
					show: {
						operation: ['upload', 'update'],
					},
				},
				default: '',
				description: 'Optional expiration date for the content',
			},

			// Content ID field for get, update, delete operations
			{
				displayName: 'Content ID',
				name: 'contentId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: '123e4567-e89b-12d3-a456-426614174000',
				description: 'The ID of the content to retrieve, update, or delete',
				required: true,
			},

			// Pagination fields for getList operation
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getList'],
					},
				},
				default: 1,
				description: 'Page number for pagination',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getList'],
					},
				},
				default: 10,
				description: 'Number of items per page',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (operation === 'upload') {
					// Upload HTML content
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const htmlContent = this.getNodeParameter('htmlContent', i) as string;
					const isPublic = this.getNodeParameter('isPublic', i) as boolean;
					const accessCode = this.getNodeParameter('accessCode', i) as string;
					const expiresAt = this.getNodeParameter('expiresAt', i) as string;

					const body: any = {
						html_content: htmlContent,
						is_public: isPublic,
					};

					if (title) body.title = title;
					if (description) body.description = description;
					if (!isPublic && accessCode) body.access_code = accessCode;
					if (expiresAt) body.expires_at = expiresAt;

					responseData = await anyWebsitesApiRequest.call(this, 'POST', '/api/content/upload', body);

				} else if (operation === 'getList') {
					// Get content list
					const page = this.getNodeParameter('page', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const qs = {
						page: page.toString(),
						limit: limit.toString(),
					};

					responseData = await anyWebsitesApiRequest.call(this, 'GET', '/api/content', {}, qs);

				} else if (operation === 'get') {
					// Get specific content
					const contentId = this.getNodeParameter('contentId', i) as string;

					responseData = await anyWebsitesApiRequest.call(this, 'GET', `/api/content/${contentId}`);

				} else if (operation === 'update') {
					// Update content
					const contentId = this.getNodeParameter('contentId', i) as string;
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const htmlContent = this.getNodeParameter('htmlContent', i) as string;
					const isPublic = this.getNodeParameter('isPublic', i) as boolean;
					const accessCode = this.getNodeParameter('accessCode', i) as string;
					const expiresAt = this.getNodeParameter('expiresAt', i) as string;

					const body: any = {
						html_content: htmlContent,
						is_public: isPublic,
					};

					if (title) body.title = title;
					if (description) body.description = description;
					if (!isPublic && accessCode) body.access_code = accessCode;
					if (expiresAt) body.expires_at = expiresAt;

					responseData = await anyWebsitesApiRequest.call(this, 'PUT', `/api/content/${contentId}`, body);

				} else if (operation === 'delete') {
					// Delete content
					const contentId = this.getNodeParameter('contentId', i) as string;

					responseData = await anyWebsitesApiRequest.call(this, 'DELETE', `/api/content/${contentId}`);

				} else {
					throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
				}

				// Add published URL for upload and update operations
				if ((operation === 'upload' || operation === 'update') && responseData.content) {
					const credentials = await this.getCredentials('anyWebsitesApi');
					const baseUrl = credentials.baseUrl as string;
					responseData.published_url = `${baseUrl}/view/${responseData.content.id}`;
				}

				returnData.push({
					json: responseData,
					pairedItem: {
						item: i,
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error occurred',
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
