export interface BubbleConfig {
  domain: string;
  apiToken: string;
  isLive?: boolean;
}

export interface BaseDataAttributes {
  _id: string;
  'Created By': string;
  'Created Date': string;
  'Modified Date': string;
}

export interface DataAPIOptions {
  domain?: string;
  isLive?: boolean;
  apiToken?: string;
  type: string;
}

export interface GetResponse<T> {
  response: T;
}

export type AllConstraintType = 'equals' | 'not_equal' | 'in' | 'not in';
export type AllConstraint<T> = {
  key: keyof T;
  constraint_type: AllConstraintType;
  value: any;
};

export type NoValueConstraintType = 'is_empty' | 'is_not_empty';
export type NoValueConstraint<T> = {
  key: keyof T;
  constraint_type: NoValueConstraintType;
};

export type ListConstraintType = 'contains' | 'not contains';
export type ListConstraint<T> = {
  key: keyof T;
  constraint_type: ListConstraintType;
  value: any[];
};

export type TextConstraintType =
  | 'greater than'
  | 'less than'
  | 'text contains'
  | 'not text contains'
  | 'geographic_search';
export type TextConstraint<T> = {
  key: keyof T;
  constraint_type: TextConstraintType;
  value: string;
};

export type NumberConstraintType = 'greater than' | 'less than';
export type NumberConstraint<T> = {
  key: keyof T;
  constraint_type: NumberConstraintType;
  value: number;
};

export type DateConstraintType = 'greater than' | 'less than';
export type DateConstraint<T> = {
  key: keyof T;
  constraint_type: DateConstraintType;
  value: string | Date;
};

export type Address =
  | string
  | {
      address: string;
      lat: number;
      lng: number;
    };
export type AddressConstraint<T> = {
  key: keyof T;
  constraint_type: 'geographic_search';
  value: {
    origin_address: Address;
    range: number;
    unit?: 'miles' | 'km';
  };
};

export type SearchConstraint<T> =
  | AllConstraint<T>
  | NoValueConstraint<T>
  | ListConstraint<T>
  | TextConstraint<T>
  | NumberConstraint<T>
  | DateConstraint<T>
  | DateConstraint<T>
  | AddressConstraint<T>;

export type SortOption<T> = {
  sort_field?: keyof T;
  descending?: boolean;
};

export type SearchQuery<T> = {
  limit?: number;
  cursor?: number;
  constraints?: SearchConstraint<T>[];
  additional_sort_fields?: SortOption<T>[];
} & SortOption<T>;

export type CreateResponse = {
  status: string;
  id: string;
};

export type FindResponse<T> = {
  response: PaginatedResponse<T>;
};

export type PaginatedResponse<T> = {
  cursor: number;
  count: number;
  remaining: number;
  results: T[];
};

export type WorkflowAPIOptions = {
  name: string;
}

export type WorkflowAPIResponse = {
  status: string;
  message?: string;
  response?: Record<string, any>;
};

export type WorkflowAPIErrorResponse = {
  statusCode: string;
  body: WorkflowAPIResponse
};
