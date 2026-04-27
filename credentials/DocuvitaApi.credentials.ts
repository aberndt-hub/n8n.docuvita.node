import {
    Icon,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class DocuvitaApi implements ICredentialType {
    name = 'docuvitaApi';
    displayName = 'Docuvita API';
    documentationUrl = 'http://www.docuvita.com';
    icon = 'file:docuvita_circle_white_cmyk.svg' as Icon;
    properties: INodeProperties[] = [
        {
            displayName: 'Service-URL',
            name: 'url',
            type: 'string',
            default: '',
        },
        {
            displayName: 'SessionGuid',
            name: 'sessionguid',
            type: 'string',
            typeOptions: {
                password: true
            },
            default: '',
        },
    ];

        // Add the test property
    test = {
        request: {
            baseURL: '={{ $credentials.url }}',
            url: '/info', // Replace with the actual endpoint for testing credentials
            method: 'GET' as const,
            headers: {
                Authorization: '={{ $credentials.sessionguid }}',
            },
        },
    };
}