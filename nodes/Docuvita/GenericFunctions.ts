import {
    INodeParameters,
} from 'n8n-workflow';
import { BaseProperty } from './DataInterfaces';

export async function mergeObjectProperties(base_props: BaseProperty[], new_props: INodeParameters[]): Promise<BaseProperty[]> {
    if (new_props.length > 0) {
        if (base_props.length > 0) {
            base_props.forEach(function (base_prop: BaseProperty) {
                new_props.forEach(function (new_prop: INodeParameters) {
                    if (
                        typeof new_prop.name === 'string' &&
                        typeof base_prop.FieldName === 'string' &&
                        base_prop.FieldName.toUpperCase() === new_prop.name.toUpperCase()
                    ) {
                        let valueField: keyof BaseProperty;
                        switch (base_prop.FieldType) {
                            case "N":
                                valueField = 'FieldValueNumeric';
                                base_prop[valueField] = new_prop.value != null ? Number(new_prop.value) : undefined;
                                break;
                            case "S":
                                valueField = 'FieldValueString';
                                base_prop[valueField] = new_prop.value != null ? new_prop.value.toString() : undefined;
                                break;
                            case "C":
                                valueField = 'FieldValueCurrency';
                                base_prop[valueField] = new_prop.value != null ? Number(new_prop.value) : undefined;
                                break;
                            case "B":
                                valueField = 'FieldValueBool';
                                base_prop[valueField] = new_prop.value != null ? Boolean(new_prop.value) : undefined;
                                break;
                            case "D":
                                valueField = 'FieldValueDateTime';
                                base_prop[valueField] = new_prop.value != null ? new Date(new_prop.value.toString()) : undefined;
                                break;
                            default:
                                valueField = 'FieldValueString';
                                base_prop[valueField] = new_prop.value != null ? new_prop.value.toString() : undefined;
                        }
                    }
                });
            });
        }
    }
    return base_props;
}