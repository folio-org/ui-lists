export interface Value {
  label: string;
  name: string;
}

export type EntityTypeOption = {
  label: string;
  id: string;
};

export type EntityTypeSelectOption = {
  label: string;
  value: string;
  selected: boolean;
  disabled?: boolean;
};

export interface EntityTypeColumn {
  name: string;
  dataType: {
    dataType: string;
  };
  labelAlias: string;
  visibleByDefault: boolean;
  values: Value[];
}

type BaseEntityType = {
  id: string;
  name: string;
  labelAlias: string;
  label: string;
  crossTenantQueriesEnabled: boolean;
  columns: EntityTypeColumn[];
};

// type safety!
export type EntityType =
  | (BaseEntityType & {
      isCustom: true;
      createdAt: string;
      updatedAt: string;
    })
  | (BaseEntityType & {
      isCustom: false;
      createdAt?: null;
      updatedAt?: null;
    });

export interface QueryBuilderColumnMetadata {
  label: string;
  value: string;
  disabled: false;
  readOnly: false;
  selected: boolean;
  dataType: string;
}
