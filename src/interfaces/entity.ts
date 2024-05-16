export interface Value {
    label: string;
    name: string;
}

export type EntityTypeOption = {
    label: string,
    id: string
};

export type EntityTypeSelectOption = {
    label: string,
    value: string,
    selected: boolean,
    disabled?: boolean
}

export interface EntityTypeColumn {
    name: string;
    dataType: {
        dataType: string;
    };
    labelAlias: string;
    visibleByDefault: boolean;
    values: Value[];
}

export interface EntityType {
    id: string;
    name: string;
    labelAlias: string;
    label: string;
    columns: EntityTypeColumn[];
}

export interface QueryBuilderColumnMetadata {
    label: string;
    value: string;
    disabled: false;
    readOnly: false;
    selected: boolean;
    dataType: string;
}
