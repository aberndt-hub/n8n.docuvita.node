import {
    INodeProperties,
} from 'n8n-workflow';

export const generalFields: INodeProperties[] = [
    {
		displayName: 'Service-Operation',
		name: 'endpoint',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'general',
				],
			},
		},
		default: '',
		description: 'The endpoint to call',
	},
    {
        displayName: 'Values to Set',
        name: 'values',
        placeholder: 'Add Value',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
            sortable: true,
        },
        displayOptions: {
			show: {
				resource: [
					'general',
				],
			},
		},
        description: 'The value to set',
        default: {},
        options: [
            {
                name: 'boolean',
                displayName: 'Boolean',
                values: [
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: 'propertyName',
                        description: 'Name of the property to write data to',
                    },
                ],
            },
        ],
    },
]