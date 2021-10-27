import fetch, { Response } from 'node-fetch';
import omit from 'lodash.omit';
import {
  BaseDataAttributes,
  GetResponse,
  SearchQuery,
  PaginatedResponse,
  FindResponse,
  CreateResponse,
} from './types';
import config from './config';

const handleError = (error: Error) => {
  console.error(error);
  throw error;
};

const handleFetchResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw errorText;
  }
  return response;
};

function buildSearchQuery<T>(query?: SearchQuery<T>): string {
  if (!query) {
    return '';
  }
  const queryString = [];
  if (query?.constraints) {
    queryString.push(
      `constraints=${encodeURIComponent(JSON.stringify(query.constraints))}`
    );
  }
  if (query?.limit) {
    queryString.push(`limit=${query.limit}`);
  }
  if (query?.cursor) {
    queryString.push(`cursor=${query.cursor}`);
  }
  if (query?.sort_field) {
    queryString.push(`sort_field=${query.sort_field}`);
  }
  if (query?.descending) {
    queryString.push(`descending=${query.descending}`);
  }
  if (query?.additional_sort_fields) {
    queryString.push(
      `additional_sort_fields=${encodeURIComponent(
        JSON.stringify(query.additional_sort_fields)
      )}`
    );
  }
  return queryString.length === 0 ? '' : `?${queryString.join('&')}`;
}

const sanitizeData = (data: any) => {
  return omit(data, [
    '_id',
    'Slug',
    'Created By',
    'Created Date',
    'Modified Date',
    '_type',
  ]);
};

export default abstract class DataAPI implements BaseDataAttributes {
  'Created Date'!: string;
  'Created By'!: string;
  'Modified Date'!: string;
  'Slug'?: string;
  _id!: string;

  abstract _type: string;

  constructor(args: Record<string, unknown>) {
    Object.assign(this, args);
  }

  private get baseUrl(): string {
    return `${config.getBaseUrl()}/obj/${this._type}`;
  }

  static async find<T extends DataAPI>(
    this: CustomDataClass<T>,
    query?: SearchQuery<T>
  ): Promise<PaginatedResponse<T>> {
    const { baseUrl } = new this({});
    const response = await fetch(`${baseUrl}${buildSearchQuery<T>(query)}`, {
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    const responseData = (await response.json()) as FindResponse<T>;
    return {
      ...responseData.response,
      results: responseData.response.results.map(
        (data: T) => new this(data as Record<string, unknown>)
      ),
    };
  }

  static async get<T extends DataAPI>(
    this: CustomDataClass<T>,
    id: string
  ): Promise<T> {
    const { baseUrl } = new this({});
    const response = await fetch(`${baseUrl}/${id}`, {
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    const responseData = (await response.json()) as GetResponse<T>;
    return new this(responseData.response as Record<string, unknown>);
  }

  static async create<T extends DataAPI>(
    this: CustomDataClass<T>,
    data: CustomDataAttributes<T>
  ): Promise<T> {
    const { baseUrl } = new this({});
    const response = await fetch(`${baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(sanitizeData(data)),
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    const responseData = (await response.json()) as CreateResponse;
    return new this({ _id: responseData.id }).refresh();
  }

  static async bulkCreate<T extends DataAPI>(
    this: CustomDataClass<T>,
    data: CustomDataAttributes<T>[]
  ): Promise<T[]> {
    const { baseUrl } = new this({});
    const response = await fetch(`${baseUrl}/bulk`, {
      method: 'POST',
      body: `${data.map((d) => JSON.stringify(sanitizeData(d))).join('\n')}`,
      headers: {
        ...config.getDefaultHeaders(),
        'Content-Type': 'text/plain',
      },
    })
      .then(handleFetchResponse)
      .catch(handleError);
    const responseData = await response.text();
    const results: CreateResponse[] = JSON.parse(
      `[${responseData.replace(/\n/g, ',')}]`
    );
    const records = await Promise.all(
      results.map((r) => new this({ _id: r.id }).refresh())
    );
    return records;
  }

  async refresh(): Promise<this> {
    const { baseUrl } = this;
    if (!this._id) {
      throw new Error('Cannot call refresh on an object with no _id');
    }
    const response = await fetch(`${baseUrl}/${this._id}`, {
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    const responseData = (await response.json()) as GetResponse<this>;
    Object.assign(this, responseData.response);
    return this;
  }

  async save(): Promise<this> {
    const { _id, baseUrl } = this;
    const isNew = !_id;
    const method = isNew ? 'POST' : 'PATCH';
    const response = await fetch(`${baseUrl}${isNew ? '' : '/' + _id}`, {
      method,
      body: JSON.stringify(sanitizeData(this)),
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    if (isNew) {
      const responseData = (await response.json()) as CreateResponse;
      this._id = responseData.id;
    }
    return this.refresh();
  }

  async delete(): Promise<boolean> {
    const { _id, baseUrl } = this;
    if (!_id) {
      throw new Error('Cannot call delete on an object with no _id');
    }
    const response = await fetch(`${baseUrl}/${_id}`, {
      method: 'DELETE',
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    return response ? response.ok : false;
  }
}

export type CustomDataClass<T extends DataAPI> = new (
  args: Record<string, unknown>
) => T;

export type CustomDataAttributes<T extends DataAPI> = Omit<T, keyof DataAPI>;
