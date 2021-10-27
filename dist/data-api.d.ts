import { BaseDataAttributes, SearchQuery, PaginatedResponse } from './types';
export default abstract class DataAPI implements BaseDataAttributes {
    'Created Date': string;
    'Created By': string;
    'Modified Date': string;
    'Slug'?: string;
    _id: string;
    abstract _type: string;
    constructor(args: Record<string, unknown>);
    private get baseUrl();
    static find<T extends DataAPI>(this: CustomDataClass<T>, query?: SearchQuery<T>): Promise<PaginatedResponse<T>>;
    static get<T extends DataAPI>(this: CustomDataClass<T>, id: string): Promise<T>;
    static create<T extends DataAPI>(this: CustomDataClass<T>, data: CustomDataAttributes<T>): Promise<T>;
    static bulkCreate<T extends DataAPI>(this: CustomDataClass<T>, data: CustomDataAttributes<T>[]): Promise<T[]>;
    refresh(): Promise<this>;
    save(): Promise<this>;
    delete(): Promise<boolean>;
}
export declare type CustomDataClass<T extends DataAPI> = new (args: Record<string, unknown>) => T;
export declare type CustomDataAttributes<T extends DataAPI> = Omit<T, keyof DataAPI>;
