import {
	INodeProperties,
	INodePropertyOptions,
} from 'n8n-workflow';

export const workflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'workflow',
				],
			},
		},
		options: [
			{
				name: 'Complete Task',
				value: 'completetask',
				description: 'Completes a specific Task',
			},
		] as INodePropertyOptions[],
		default: 'completetask',
	},
];

export const workflowFields: INodeProperties[] = [
	{
		displayName: 'TaskId',
		name: 'taskid',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'completetask',
				],
				resource: [
					'workflow',
				],
			},
		},
		default: '',
		description: 'TaskId to complete',
	},
	{
		displayName: 'TaskProperties',
		name: 'taskproperties',
		required: true,
		type: 'json',
		displayOptions: {
			show: {
				operation: [
					'completetask',
				],
				resource: [
					'workflow',
				],
			},
		},
		default: '[]',
		description: 'Properties of the task',
	},
];
