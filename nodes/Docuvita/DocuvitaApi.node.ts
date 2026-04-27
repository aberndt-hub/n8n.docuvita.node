import {
	IDataObject,
	INodeExecutionData,
	INodeParameters,
	INodeType,
	INodeTypeDescription,
	IBinaryData,
	NodeOperationError,
	IExecuteFunctions,
	IHttpRequestOptions,
	LoggerProxy as Logger
} from 'n8n-workflow';

import {
	queryOperation,
	queryFields,
} from './Query'

import {
	objectOperations,
	objectFields,
} from './Object'

import {
	generalFields,
} from './General'

import {
	mergeObjectProperties,
} from './GenericFunctions'

import {
	workflowFields,
	workflowOperations,
} from './Workflow'
import { BaseProperty } from './DataInterfaces';

type BinaryBuffer = { length: number };
declare const Buffer: {
	from(input: string, encoding: string): BinaryBuffer;
	concat(chunks: Array<unknown>): BinaryBuffer;
};

export class DocuvitaApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Docuvita',
		name: 'docuvitaApi',
		icon: 'file:docuvita_circle_white_cmyk.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Docuvita API',
		defaults: {
			name: 'Docuvita',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'docuvitaApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Resource',
				noDataExpression: true,
				name: 'resource',
				type: 'options',
				options: [

					{
						name: 'General',
						value: 'general',
					},
					{
						name: 'Info',
						value: 'info',
					},
					{
						name: 'Object',
						value: 'object',
					},
					{
						name: 'Query',
						value: 'query'
					},
					{
						name: 'Workflow',
						value: 'workflow'
					}
				],
				default: 'info',
				required: true,
				description: 'Kategorie der API'
			},

			...queryOperation,
			...queryFields,
			...objectOperations,
			...objectFields,
			...generalFields,
			...workflowOperations,
			...workflowFields,

			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				default: {},
				type: 'collection',
				displayOptions: {
					show: {
						resource: [
							'object',
							'info',
							'general',
							'query',
							'workflow',
						],
					},
				},
				options: [
					{
						displayName: 'Simplify',
						name: 'simple',
						type: 'boolean',
						default: true,
						description: 'Whether to return a simplified version of the response instead of the raw data',
						displayOptions: {
							show: {
								'/operation': [
									'getobjectproperties',
								],
							},
						},
					},
					{
						displayName: 'Use Different Session GUID',
						name: 'diff_session',
						type: 'string',
						default: '',
						description: 'This session GUID is used instead of the one configured in the credentials',
					},
					{
						displayName: 'VersionNumber',
						name: 'versionnumber',
						type: 'collection',
						default: {},
						displayOptions: {
							show: {
								'/operation': [
									'uploadnewversion',
								],
							},
						},
						options: [
							{
								displayName: 'VersionIncrementStyle',
								name: 'versionincrementstyle',
								type: 'options',
								default: 0,
								options: [
									{
										name: 'NoVersionIncrement',
										value: 0,
									},
									{
										name: 'SpecifyVersionNumber',
										value: 13,
									},
									{
										name: 'IncrementMajor',
										value: 10,
									},
									{
										name: 'IncrementMinor',
										value: 11,
									},
									{
										name: 'IncrementRevision',
										value: 12,
									},
								],
							},
							{
								displayName: 'VersionLabel',
								name: 'versionlabel',
								type: 'string',
								default: '',
							},
							{
								displayName: 'VersionMajor1',
								name: 'versionmajor',
								required: true,
								type: 'number',
								default: null,
							},
							{
								displayName: 'VersionMinor',
								name: 'versionminor',
								type: 'number',
								default: null,
							},
							{
								displayName: 'VersionRevision',
								name: 'versionrevision',
								type: 'number',
								default: null,
							},
						],
					},
				],
			},
		],
	};



	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = []
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const options = this.getNodeParameter('options', 0) as IDataObject;
		let operation = "";

		try {
			operation = this.getNodeParameter('operation', 0) as string;
		} catch (error) {
			this.logger.debug('No operation parameter, defaulting to empty string' + error.message.toString());
		}

		const credentials = await this.getCredentials('docuvitaApi') as IDataObject;

		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'Failed to get credentials!');
		}

		let base_uri: string = `${credentials.url}`
		let my_session: string = `${credentials.sessionguid}`

		if (!base_uri.endsWith('/')) {
			base_uri = base_uri + '/';
		}

		if (options.diff_session != undefined) {
			if (options.diff_session != '') {
				//console.log('Using alternative session Guid')
				my_session = options.diff_session as string;
			}
		}

		interface IKeys {
			[key: string]: string | number | boolean | undefined;
		}

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'info') {
					const options: IHttpRequestOptions = {
						method: 'POST',
						body: {
							'format': 'json'
						},
						url: base_uri + 'info',
						json: true,
					};

					responseData = await this.helpers.httpRequest(options)
					returnData.push(responseData);
				}

				if (resource === 'general') {
					//const values = this.getNodeParameter('values', i) as IDataObject;
					const endpoint = this.getNodeParameter('endpoint', i) as IDataObject;

					const data: IDataObject = {
						sessionguid: my_session,
					};

					//console.log(data);

					(this.getNodeParameter('values.string', i, []) as INodeParameters[]).forEach((setItem: INodeParameters) => {
						if (typeof setItem.name === 'string') {
							data[setItem.name] = setItem.value;
						}
					});
					(this.getNodeParameter('values.number', i, []) as INodeParameters[]).forEach((setItem: INodeParameters) => {
						if (typeof setItem.name === 'string') {
							data[setItem.name] = setItem.value;
						}
					});
					(this.getNodeParameter('values.boolean', i, []) as INodeParameters[]).forEach((setItem: INodeParameters) => {
						if (typeof setItem.name === 'string') {
							data[setItem.name] = setItem.value;
						}
					});

					//console.log(data);

					const options: IHttpRequestOptions = {
						method: 'POST',
						body: data,
						url: base_uri + endpoint,
						json: true,
					};

					responseData = await this.helpers.httpRequest(options)
					returnData.push(responseData);
				}

				if (resource === 'query') {

					/* ******************************************************* */
					/* GET QUERY RESULTSET */
					/* ******************************************************* */

					if (operation === 'getqueryresultset') {
						const pagesize = this.getNodeParameter('pagesize', i) as string;
						const pagenumber = this.getNodeParameter('pagenumber', i) as string;
						const querydetails = this.getNodeParameter('querydetails', i) as string;
						const resultsortconditions = '[{"SortOrder":2,"SortProperty":-114}]';


						const data: IDataObject = {
							pageNumber: pagenumber,
							pageSize: pagesize,
							QueryDetails: JSON.parse(querydetails),
							ResultSortConditions: JSON.parse(resultsortconditions),
							SessionGuid: my_session,
						}

						const options: IHttpRequestOptions = {

							method: 'POST',
							body: data,
							url: base_uri + operation,
							json: true,
						}

						//console.log(options)

						responseData = await this.helpers.httpRequest(options)
						returnData.push(responseData);
					}

					/* ******************************************************* */
					/* GET SAVED QUERIES */
					/* ******************************************************* */

					if (operation == 'getsavedqueries') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const data: IDataObject = {
							sessionguid: my_session
						}


						Object.assign(data, additionalFields)

						const options: IHttpRequestOptions = {
							method: 'POST',
							body: data,
							url: base_uri + operation,
							json: true,
						};

						responseData = await this.helpers.httpRequest(options)
						returnData.push(responseData);
					}
				}

				if (resource === 'object') {

					/* ******************************************************* */
					/* SET DELETE FLAG */
					/* ******************************************************* */

					if (operation == 'setdeleteflag') {
						const obj_id = this.getNodeParameter('objectid', i) as number;
						//console.log(obj_id)
						const delete_reason = this.getNodeParameter('deletereason', i) as number;
						//console.log(delete_reason)
						const include_subitems = this.getNodeParameter('includesubitems', i) as boolean;
						//console.log(include_subitems)
						const delete_reason_text = this.getNodeParameter('deletereasontext', i) as string;
						//console.log(delete_reason_text)

						const body_data: IDataObject = {
							deleteflagelements: {
								objectid: obj_id,
								deletereason: delete_reason,
								includesubitems: include_subitems,
								deletereasontext: delete_reason_text,
							},
							sessionguid: my_session,
						}

						const options_delete: IHttpRequestOptions = {
							method: 'POST',
							body: body_data,
							url: base_uri + 'setdeleteflag',
							json: true,
						}

						responseData = await this.helpers.httpRequest(options_delete)
						return [this.helpers.returnJsonArray(responseData)]
					}

					/* ******************************************************* */
					/* CREATE OBEJECT */
					/* ******************************************************* */
					Logger.info('Operation: ' + operation)
					if (operation == 'createobject') {
						let binarydataname: string = '';
						const obj_name = this.getNodeParameter('objname', i) as string;
						const obj_parent = this.getNodeParameter('objparent', i) as number;
						const obj_type = this.getNodeParameter('objtype', i) as number;
						const object_properties = this.getNodeParameter('properties', i) as IDataObject;
						const uploadversion = this.getNodeParameter('uploadversion', i) as boolean;

						try {
							binarydataname = this.getNodeParameter('binarydata', i) as string;
						} catch (error) {
							this.logger.debug('No binary data parameter, defaulting to empty string' + error.message.toString());
						}

						//const responseData_get;
						//console.log(object_properties)

						const body_data_get: IDataObject = {
							sessionguid: my_session,
							purpose: 'NewObject',
							objecttypeid: obj_type,
						}
						//console.log(body_data_get)

						const options_get: IHttpRequestOptions = {
							method: 'POST',
							body: body_data_get,
							url: base_uri + 'getobjectproperties',
							json: true,
						};

						const responseData_get = await this.helpers.httpRequest(options_get);

						const propertyList = responseData_get['ObjectPropertyList'];

						propertyList.forEach(function (prop: BaseProperty) {
							if (prop.FieldName && prop.FieldName.toUpperCase() === 'OBJ_NAME'.toUpperCase()) {
								prop.FieldValueString = obj_name;
							}
							if (prop.FieldName && prop.FieldName.toUpperCase() === 'OBJ_PARENTOBJECT'.toUpperCase()) {
								prop.FieldValueNumeric = obj_parent;
							}
						})

						const parameters = object_properties['parameter'] as INodeParameters[];

						if (Array.isArray(parameters) && parameters.length > 0) {
							parameters.forEach(function (item) {
								propertyList.forEach(function (prop: BaseProperty) {
									if (item.name != undefined && item.value != undefined) {
										if (typeof prop.FieldName === 'string' && prop.FieldName.toUpperCase() === item.name.toString().toUpperCase()) {
											switch (prop.FieldType) {
												case "N":
													prop.FieldValueNumeric = Number(item.value);
													break;
												case "S":
													prop.FieldValueString = item.value.toString();
													break;
												case "C":
													prop.FieldValueCurrency = Number(item.value);
													break;
												case "B":
													prop.FieldValueBool = item.value === 'true' || item.value === true ? true : false;
													break;
												case "D":
													prop.FieldValueDateTime = new Date(item.value.toString());
													break;
												default:
													prop.FieldValueString = item.value.toString();
											}
										}
									}
								});
							});
						} else {
							Logger.info('No parameters found or parameters are not an array.');
						}

						const item = items[i];
						let binaryProperty;

						if (item.binary != undefined) {
							binaryProperty = item.binary[binarydataname] as IBinaryData;
							//console.log(binaryProperty)
						}

						const body_data_set: IDataObject = {};
						body_data_set['ObjectPropertyList'] = propertyList;
						body_data_set['sessionguid'] = my_session;

						if (uploadversion == true && binaryProperty != undefined) {
							body_data_set['VersionOriginalFilename'] = binaryProperty['fileName'];
						}
						//console.log(body_data_set)

						const options_set: IHttpRequestOptions = {
							method: 'POST',
							body: body_data_set,
							url: base_uri + 'setobjectproperties',
							json: true,
						};

						const responseData_set = await this.helpers.httpRequest(options_set);
						const objid = responseData_set['ObjectPropertyList'].find((x: { FieldName: string; }) => x.FieldName === 'OBJ_OBJECTID').FieldValueNumeric

						if (uploadversion == true && item.binary != undefined) {
							const binaryData = this.helpers.assertBinaryData(i, binarydataname);
							const buffer = await this.helpers.getBinaryDataBuffer(i, binarydataname);
							const fileName = binaryData.fileName ?? 'file';
							const mimeType = binaryData.mimeType ?? 'application/octet-stream';
							const boundary = `----n8nFormBoundary${Date.now()}`;
							const preamble =
								`--${boundary}\r\n` +
								`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
								`Content-Type: ${mimeType}\r\n\r\n`;
							const closing = `\r\n--${boundary}--\r\n`;
							const bodyBuffer = Buffer.concat([
								Buffer.from(preamble, 'utf8'),
								buffer as unknown as BinaryBuffer,
								Buffer.from(closing, 'utf8'),
							]);

							const requestOptions: IHttpRequestOptions = {
								method: 'POST',
								url: base_uri + 'fileupload?guid=' + responseData_set.DocUploadGuid,
								headers: {
									'Content-Type': `multipart/form-data; boundary=${boundary}`,
									'Content-Length': bodyBuffer.length,
								},
								body: bodyBuffer,
							};

							let response = await this.helpers.httpRequest(requestOptions);
							Logger.info('File upload response: ' + JSON.stringify(response));
							if (response == undefined) {
								response = {}
							}
							Logger.info('Response after file upload: ' + JSON.stringify(response));
							response['ObjectId'] = objid;
							returnData.push(response);
						}
					}
					/* ******************************************************* */
					/* GET OBJECT */
					/* ******************************************************* */

					if (operation == 'getobject') {
						const objectid = this.getNodeParameter('objectid', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const data: IDataObject = {
							objectid,
							sessionguid: my_session
						}

						Object.assign(data, additionalFields)

						const options: IHttpRequestOptions = {
							method: 'POST',
							body: data,
							url: base_uri + operation,
							json: true,
						};

						responseData = await this.helpers.httpRequest(options)
						returnData.push(responseData);
					}

					/* ******************************************************* */
					/* GET OBJECT PROPERTIES */
					/* ******************************************************* */

					if (operation == 'getobjectproperties') {
						const objectid = this.getNodeParameter('objectid', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						let simply = undefined;
						//console.log(options)
						if (options.simple !== undefined) {
							simply = options.simple as boolean;
							//console.log(simply)
						}

						const data: IDataObject = {
							objectid,
							sessionguid: my_session
						}

						Object.assign(data, additionalFields)

						const req_options: IHttpRequestOptions = {
							method: 'POST',
							body: data,
							url: base_uri + operation,
							json: true,
						};

						responseData = await this.helpers.httpRequest(req_options)

						if (simply == true) {
							const simpleOutput = responseData['ObjectPropertyList'];
							const newIt: IKeys = {};
							simpleOutput.forEach(function (item: BaseProperty) {
								const property = item.FieldName;
								let value: string = '';
								switch (item.FieldType) {
									case "N":
										value = item.FieldValueNumeric !== undefined && item.FieldValueNumeric !== null ? item.FieldValueNumeric.toString() : '0';
										break;
									case "S":
										value = item.FieldValueString !== undefined ? item.FieldValueString : '';
										break;
									case "C":
										value = item.FieldValueCurrency !== undefined && item.FieldValueCurrency !== null ? item.FieldValueCurrency.toString() : '';
										break;
									case "B":
										value = item.FieldValueBool !== undefined && item.FieldValueBool !== null ? item.FieldValueBool.toString() : '';
										break;
									case "D":
										value = item.FieldValueDateTime !== undefined && item.FieldValueDateTime !== null
											? item.FieldValueDateTime.toString()
											: '';
										break;
									default:
										value = '';
										break;
								}
								if (property !== undefined) {
									newIt[property] = value;
								}
								//Object.assign(newIt, {property: '1'});
							});
							//arr.push(newIt)
							//responseData = arr;
							returnData.push(newIt);
						} else {
							returnData.push(responseData);
						}
					}

					/* ******************************************************* */
					/* UPLOAD NEW VERSION */
					/* ******************************************************* */

					if (operation == 'uploadnewversion') {
						let binarydataname: string = '';
						//console.log('uploadnewversion')
						const objectid = this.getNodeParameter('objectid', i) as number;
						//console.log(objectid);
						const versioncomment = this.getNodeParameter('versioncomment', i) as string;
						//console.log(versioncomment);
						const properties = this.getNodeParameter('properties', i) as IDataObject;
						//console.log(properties);
						const versionexternalmetadata = this.getNodeParameter('versionexternalmetadata', i) as string;
						//console.log(versionexternalmetadata)
						const checkin = this.getNodeParameter('checkin', i) as boolean;
						//console.log(checkin)
						const appendtoprevious = this.getNodeParameter('appendtoprevious', i) as boolean;
						//console.log(appendtoprevious)
						//let opts: any = {};
						const opts = this.getNodeParameter('options', i) as IDataObject;
						//console.log(opts)

						try {
							binarydataname = this.getNodeParameter('binarydata_newversion', i) as string;
						} catch (error) {
							this.logger.debug('No binary data parameter, defaulting to empty string' + error.message.toString());
						}

						// getObjectProperties
						//console.log('getObjectProperties');

						//let responseData_get;
						//console.log(object_properties)

						const body_data_get: IDataObject = {
							sessionguid: my_session,
							objectid: objectid,
						}
						//console.log(body_data_get)

						const options_get: IHttpRequestOptions = {
							method: 'POST',
							body: body_data_get,
							url: base_uri + 'getobjectproperties',
							json: true,
						};

						const responseData_get = await this.helpers.httpRequest(options_get);

						const propertyList = responseData_get['ObjectPropertyList'];
						//console.log(propertyList);

						const parameters = properties['parameter'] as INodeParameters[];
						//console.log(parameters);
						let new_properties = propertyList;
						if (parameters != undefined) {
							new_properties = await mergeObjectProperties(propertyList, parameters)
						}

						//console.log(new_properties)

						// setObjectProperties
						const body_data_set_objprops: IDataObject = {
							objectpropertylist: new_properties,
							objectid: objectid,
							sessionguid: my_session,
						}

						const options_set_objprops: IHttpRequestOptions = {
							method: 'POST',
							body: body_data_set_objprops,
							url: base_uri + 'setobjectproperties',
							json: true,
						};

						await this.helpers.httpRequest(options_set_objprops);

						//console.log(responseData_set_objprops)

						if (!Object.prototype.hasOwnProperty.call(opts, 'versionnumber')) {
							opts.versionnumber = {
								versionincrementstyle: 0,
								versionmajor: null,
								versionminor: null,
								versionrevision: null,
								versionlabel: '',
							} as {
								versionincrementstyle: number;
								versionmajor: number | null;
								versionminor: number | null;
								versionrevision: number | null;
								versionlabel: string;
							};
						}


						const item = items[i];
						let binaryProperty;

						if (item.binary != undefined) {
							binaryProperty = item.binary[binarydataname] as IBinaryData;
							//console.log(binaryProperty)
							
						}

						// set Version
						if (binaryProperty != undefined) {
							const body_data_set_version = {
								sessionguid: my_session,
								objectid: objectid,
								checkin: checkin,
								versionoriginalfilename: binaryProperty['fileName'],
								versioncomment: versioncomment,
								versionexternalmetadata: versionexternalmetadata,
								versionnumber: {
									versionincrementstyle: (opts.versionnumber as IDataObject)?.versionincrementstyle ?? 0,
									versionmajor: (opts.versionnumber as IDataObject)?.versionmajor ?? null,
									versionminor: (opts.versionnumber as IDataObject)?.versionminor ?? null,
									versionrevision: (opts.versionnumber as IDataObject)?.versionrevision ?? null,
									versionlabel: (opts.versionnumber as IDataObject)?.versionlabel ?? '',
								},
								appendtoprevious: appendtoprevious,
							}
							//console.log(body_data_set_version)

							const options_set_version: IHttpRequestOptions = {
								method: 'POST',
								body: body_data_set_version,
								url: base_uri + 'setversion',
								json: true,
							};

							const responseData_get = await this.helpers.httpRequest(options_set_version);
							//console.log(responseData_get);

							const uploadguid = responseData_get.DocUploadGuid;

							// Upload
							if (item.binary != undefined) {
															const binaryData = this.helpers.assertBinaryData(i, binarydataname);
							const buffer = await this.helpers.getBinaryDataBuffer(i, binarydataname);
							const fileName = binaryData.fileName ?? 'file';
							const mimeType = binaryData.mimeType ?? 'application/octet-stream';
							const boundary = `----n8nFormBoundary${Date.now()}`;
							const preamble =
								`--${boundary}\r\n` +
								`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
								`Content-Type: ${mimeType}\r\n\r\n`;
							const closing = `\r\n--${boundary}--\r\n`;
							const bodyBuffer = Buffer.concat([
								Buffer.from(preamble, 'utf8'),
								buffer as unknown as BinaryBuffer,
								Buffer.from(closing, 'utf8'),
							]);

							const requestOptions: IHttpRequestOptions = {
								method: 'POST',
								url: base_uri + 'fileupload?guid=' + uploadguid,
								headers: {
									'Content-Type': `multipart/form-data; boundary=${boundary}`,
									'Content-Length': bodyBuffer.length,
								},
								body: bodyBuffer,
							};

							const response = await this.helpers.httpRequest(requestOptions);
								if (response.success == true) {

									const data: IDataObject = {
										objectid,
										sessionguid: my_session
									}

									const options: IHttpRequestOptions = {
										method: 'POST',
										body: data,
										url: base_uri + "getobject",
										json: true,
									};

									const responseDataGetObject = await this.helpers.httpRequest(options)
									//console.log(responseDataGetObject.Latestversion)
									response.latestversion = responseDataGetObject.Latestversion
									returnData.push(responseDataGetObject);

								}

								returnData.push(responseData);
							}
						}
					}

					/* ******************************************************* */
					/* SET OBJECT PROPERTIES */
					/* ******************************************************* */
					if (operation == 'setobjectproperties') {
						const objectid = this.getNodeParameter('objectid', i) as string;
						const properties = this.getNodeParameter('properties', i) as IDataObject;
						//console.log(properties);

						if (Object.prototype.hasOwnProperty.call(properties, 'parameter')) {
							const parameters = properties['parameter'] as INodeParameters[];
							if (parameters.length > 0) {
								const data: IDataObject = {
									objectid,
									sessionguid: my_session
								}

								const req_options: IHttpRequestOptions = {
									method: 'POST',
									body: data,
									url: base_uri + 'getobjectproperties',
									json: true,
								};

								const responseData_get = await this.helpers.httpRequest(req_options)
								//console.log(responseData)

								const propertyList = responseData_get['ObjectPropertyList'];
								//console.log(propertyList);

								let new_properties = propertyList;
								new_properties = await mergeObjectProperties(propertyList, parameters);

								const body_data_set_objprops: IDataObject = {
									objectpropertylist: new_properties,
									objectid: objectid,
									sessionguid: my_session,
								}

								const options_set_objprops: IHttpRequestOptions = {
									method: 'POST',
									body: body_data_set_objprops,
									url: base_uri + 'setobjectproperties',
									json: true,
								};

								const responseData_set_objprops = await this.helpers.httpRequest(options_set_objprops);
								//console.log(responseData_set_objprops);
								returnData.push(responseData_set_objprops);

							} else {
								throw new NodeOperationError(this.getNode(), `No properties specified!`);
							}
						} else {
							throw new NodeOperationError(this.getNode(), `No properties specified!`);
						}
					}
				}

				if (resource === 'workflow') {

					/* ******************************************************* */
					/* COMPLETE TASK */
					/* ******************************************************* */
					if (operation === 'completetask' || operation === '') {
						const taskid = this.getNodeParameter('taskid', i) as string
						const taskpropertiesRaw = this.getNodeParameter('taskproperties', i);

						let parsedTaskproperties: IDataObject = {};
						if (typeof taskpropertiesRaw === 'string') {
							if (taskpropertiesRaw.trim() !== '') {
								try {
									parsedTaskproperties = JSON.parse(taskpropertiesRaw);
								} catch {
									throw new NodeOperationError(this.getNode(), `TaskProperties contains invalid JSON: ${taskpropertiesRaw}`);
								}
							}
						} else if (taskpropertiesRaw !== null && taskpropertiesRaw !== undefined) {
							parsedTaskproperties = taskpropertiesRaw as IDataObject;
						}

						const data: IDataObject = {
							SessionGuid: my_session,
							TaskProperties: parsedTaskproperties,
							Taskid: Number(taskid),
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							body: data,
							url: base_uri + 'completetask',
							json: true,
						};

						responseData = await this.helpers.httpRequest(options)
						returnData.push(responseData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.toString() });
					continue;
				}

				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
