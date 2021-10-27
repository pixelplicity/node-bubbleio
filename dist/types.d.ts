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
export declare type AllConstraintType = 'equals' | 'not_equal' | 'in' | 'not in';
export declare type AllConstraint<T> = {
    key: keyof T;
    constraint_type: AllConstraintType;
    value: any;
};
export declare type NoValueConstraintType = 'is_empty' | 'is_not_empty';
export declare type NoValueConstraint<T> = {
    key: keyof T;
    constraint_type: NoValueConstraintType;
};
export declare type ListConstraintType = 'contains' | 'not contains';
export declare type ListConstraint<T> = {
    key: keyof T;
    constraint_type: ListConstraintType;
    value: any[];
};
export declare type TextConstraintType = 'greater than' | 'less than' | 'text contains' | 'not text contains' | 'geographic_search';
export declare type TextConstraint<T> = {
    key: keyof T;
    constraint_type: TextConstraintType;
    value: string;
};
export declare type NumberConstraintType = 'greater than' | 'less than';
export declare type NumberConstraint<T> = {
    key: keyof T;
    constraint_type: NumberConstraintType;
    value: number;
};
export declare type DateConstraintType = 'greater than' | 'less than';
export declare type DateConstraint<T> = {
    key: keyof T;
    constraint_type: DateConstraintType;
    value: string | Date;
};
export declare type Address = string | {
    address: string;
    lat: number;
    lng: number;
};
export declare type AddressConstraint<T> = {
    key: keyof T;
    constraint_type: 'geographic_search';
    value: {
        origin_address: Address;
        range: number;
        unit?: 'miles' | 'km';
    };
};
export declare type SearchConstraint<T> = AllConstraint<T> | NoValueConstraint<T> | ListConstraint<T> | TextConstraint<T> | NumberConstraint<T> | DateConstraint<T> | DateConstraint<T> | AddressConstraint<T>;
export declare type SortOption<T> = {
    sort_field?: keyof T;
    descending?: boolean;
};
export declare type SearchQuery<T> = {
    limit?: number;
    cursor?: number;
    constraints?: SearchConstraint<T>[];
    additional_sort_fields?: SortOption<T>[];
} & SortOption<T>;
export declare type CreateResponse = {
    status: string;
    id: string;
};
export declare type FindResponse<T> = {
    response: PaginatedResponse<T>;
};
export declare type PaginatedResponse<T> = {
    cursor: number;
    count: number;
    remaining: number;
    results: T[];
};
