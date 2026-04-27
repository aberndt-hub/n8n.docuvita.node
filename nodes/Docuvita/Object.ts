import {
	INodeProperties,
} from 'n8n-workflow';

export const objectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'object',
				],
			},
		},
		options: [
			{
				action: 'Create object function',
				name: 'Create Object (Function)',
				value: 'createobject',
				description: 'Creates an Object',
			},
			{
				action:	'Get object',
				name: 'Get Object',
				value: 'getobject',
				description: 'Retrieves a single object by ID',
			},
			{
				action:	'Get object properties',
				name: 'Get Object Properties',
				value: 'getobjectproperties',
				description: 'Retrieves all properties of a single object by ID, in an easily displayable list',
			},
			{
				action:	'Set delete flag',
				name: 'Set Delete Flag',
				value: 'setdeleteflag',
				description: 'Sets the delete flag for an object',
			},
			{
				action: 'Set object properties',
				name: 'Set Object Properties (Function)',
				value: 'setobjectproperties',
				description: 'Creates or edits an object using a list of object properties, as received via GetObjectProperties',
			},
			{
				action: 'Upload new version',
				name: 'Upload New Version (Function)',
				value: 'uploadnewversion'
			},
		],
		default: 'getobject'
	},
];

export const objectFields: INodeProperties[] = [
	{
		displayName: 'ObjectId',
		name: 'objectid',
		required: true,
		type: 'string' as const,
		displayOptions: {
			show: {
				operation: [
					'getobject',
					'getobjectproperties',
					'setdeleteflag',
					'uploadnewversion',
					'setobjectproperties',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The object\'s ID',
	},
	{
		displayName: 'VersionComment',
		name: 'versioncomment',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'uploadnewversion',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The version comment',
	},
	{
		displayName: 'VersionExternalMetaData',
		name: 'versionexternalmetadata',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'uploadnewversion',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The version\'s external metadata',
	},
	{
		displayName: 'CheckIn',
		name: 'checkin',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: [
					'uploadnewversion',
				],
				resource: [
					'object',
				],
			},
		},
		default: false,
		description: 'Whether to check in the new version',
	},
	{
		displayName: 'Whether To Append The New Version to the Previous Version Instead of Creating a New Version',
		name: 'appendtoprevious',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: [
					'uploadnewversion',
				],
				resource: [
					'object',
				],
			},
		},
		default: false,
	},
	{
		displayName: 'DeleteReason',
		name: 'deletereason',
		required: true,
		type: 'options' as const,
		displayOptions: {
			show: {
				operation: [
					'setdeleteflag'
				],
				resource: [
					'object',
				],
			},
		},
		options: [
			{
				displayName: 'Other',
				name: 'Other',
				value: '0',
			},
			{
				displayName: 'Invalid',
				name: 'Invalid',
				value: '1',
			},
			{
				displayName: 'Duplicate',
				name: 'Duplicate',
				value: '2',
			},
			{
				displayName: 'Test',
				name: 'Test',
				value: '3',
			},
			{
				displayName: 'Expired',
				name: 'Expired',
				value: '4',
			},
			{
				displayName: 'Data Privacy Protection',
				name: 'DataPrivacyProtection',
				value: '5',
			},
		],
		default: 'Other',
		description: 'The reason for deletion',
	},
	{
		displayName: 'IncludeSubItems',
		name: 'includesubitems',
		required: true,
		type: 'boolean',
		displayOptions: {
			show: {
				operation: [
					'setdeleteflag'
				],
				resource: [
					'object',
				],
			},
		},
		default: false,
		description: 'Whether to include sub-items',
	},
	{
		displayName: 'DeleteReasonText',
		name: 'deletereasontext',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'setdeleteflag'
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The delete reason text',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: [
					'getobject',
				],
				resource: [
					'object',
				],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'SubselectPath',
				name: 'subselectpath',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				operation: [
					'getobjectproperties',
				],
				resource: [
					'object',
				],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'ObjectTypeId',
				name: 'objecttypeid',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Purpose',
				name: 'purpose',
				type: 'options',
				options: [
					{
						name: 'DisplayObject',
						value: '0'
					},
					{
						name: 'NewObject',
						value: '1'
					},
					{
						name: 'Search',
						value: '2'
					},
					{
						name: 'MetadataGeneration',
						value: '3'
					},
					{
						name: 'Sort',
						value: '4'
					},
					{
						name: 'ChangeType',
						value: '5'
					},
					{
						name: 'Export',
						value: '6'
					},
				],
				default: '0',
			},
			{
				displayName: 'ParentObject',
				name: 'parentobject',
				type: 'number',
				default: '',
			},
		],
	},
	{
		displayName: 'Upload Version',
		name: 'uploadversion',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				operation: [
					'createobject',
				],
				resource: [
					'object',
				],
			},
		},
	},
	{
		displayName: 'BinaryData',
		name: 'binarydata',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				uploadversion: [
					true,
				],
				operation: [
					'createobject',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The binary data of the object to upload',
	},
	{
		displayName: 'BinaryData',
		name: 'binarydata_newversion',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'uploadnewversion',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The binary data of the object to upload',
	},
	{
		displayName: 'Object Name (OBJ_NAME)',
		name: 'objname',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'createobject',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The objects name (required)',
	},
	{
		displayName: 'Objecttype',
		name: 'objtype',
		required: true,
		type: 'number',
		displayOptions: {
			show: {
				operation: [
					'createobject',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The ObjecttypeId',
	},
	{
		displayName: 'Parent',
		name: 'objparent',
		required: true,
		type: 'number',
		displayOptions: {
			show: {
				operation: [
					'createobject',
				],
				resource: [
					'object',
				],
			},
		},
		default: '',
		description: 'The Parents ObjectId',
	},
	{
		displayName: 'Additional Properties',
		name: 'properties',
		placeholder: 'Add Propery',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: [
					'createobject',
					'uploadnewversion',
					'setobjectproperties'
				],
				resource: [
					'object',
				],
			},
		},
		description: 'Additional property fields',
		default: {},
		options: [
			{
				name: 'parameter',
				displayName: 'Property',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the parameter',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the parameter',
					},
				],
			},
		],
	},
]