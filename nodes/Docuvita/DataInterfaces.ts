/*

dvObjectProperty Parameters:
Name	Parameter	Data Type	Required	Description
FieldId	form	int	No	
FieldName	form	string	No	
FieldPrompt	form	string	No	
FieldFormat	form	string	No	
FieldDescription	form	string	No	
FieldDocumentation	form	string	No	
FieldType	form	string	No	
MultiLine	form	bool	No	
FieldValueString	form	string	No	
FieldValueDateTime	form	DateTime?	No	
FieldValueNumeric	form	int?	No	
FieldValueBool	form	bool?	No	
FieldValueCurrency	form	double?	No	
Position	form	int	No	
Category	form	string	No	
Required	form	bool	No	
LookupValuesOnly	form	bool	No	
LookupValues	form	string[]	No	
ReadOnly	form	bool	No	
Visible	form	bool	No	
IsListType	form	bool	No	
ClearBeforeShow	form	bool	No	
FieldLookupType	form	dvFieldLookupType	No	
FieldLookupFilter	form	string[]	No	
FieldLookupPluginName	form	string	No	
FieldLookupValueMapping	form	string	No	
FieldLookupPluginFilter	form	string	No	
FieldLookupPluginListener	form	string	No	
Masked	form	bool	No	
ListValuesString	form	string[]	No	
ListValuesDateTime	form	Nullable<DateTime>[]	No	
ListValuesNumeric	form	Nullable<Int32>[]	No	
ListValuesBool	form	Nullable<Boolean>[]	No	
ListValuesCurrency	form	Nullable<Double>[]	No	
CustomFunctions	form	string[]	No	
CustomRenderer	form	string	No	
Dirty	form	bool	No
*/

export interface BaseProperty {
    FieldId?: number;
    FieldName?: string;
    FieldPrompt?: string;
    FieldFormat?: string;
    FieldDescription?: string;
    FieldDocumentation?: string;
    FieldType?: string;
    MultiLine?: boolean;
    FieldValueString?: string;
    FieldValueDateTime?: Date | null;
    FieldValueNumeric?: number | null;
    FieldValueBool?: boolean | null;
    FieldValueCurrency?: number | null;
    Position?: number;
    Category?: string;
    Required?: boolean;
    LookupValuesOnly?: boolean;
    LookupValues?: string[];
    ReadOnly?: boolean;
    Visible?: boolean;
    IsListType?: boolean;
    ClearBeforeShow?: boolean;
    FieldLookupType?: string; // dvFieldLookupType
    FieldLookupFilter?: string[];
    FieldLookupPluginName?: string;
    FieldLookupValueMapping?: string;
    FieldLookupPluginFilter?: string;
    FieldLookupPluginListener?: string;
    Masked?: boolean;
    ListValuesString?: string[];
    ListValuesDateTime?: (Date | null)[];
    ListValuesNumeric?: (number | null)[];
    ListValuesBool?: (boolean | null)[];
    ListValuesCurrency?: (number | null)[];
    CustomFunctions?: string[];
    CustomRenderer?: string;
    Dirty?: boolean;
}