export interface Value {
    label: string;
    name: string;
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
