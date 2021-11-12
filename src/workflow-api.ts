import fetch, { Response } from 'node-fetch';
import qs from 'qs';
import omit from 'lodash.omit';
import {
  BaseDataAttributes,
  GetResponse,
  SearchQuery,
  PaginatedResponse,
  FindResponse,
  CreateResponse,
  WorkflowAPIErrorResponse,
  WorkflowAPIResponse,
  WorkflowAPIOptions
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

function buildRequestQuery(querystring?: Record<string, unknown>): string {
  if (!querystring) {
    return '';
  }
  return qs.stringify(querystring, { addQueryPrefix: true });
}

export default class WorkflowAPI {
  _name: string;

  constructor(options: WorkflowAPIOptions) {
    this._name = options.name;
  }

  private get baseUrl(): string {
    return `${config.getBaseUrl()}/wf/${this._name}`;
  }

  async send(
    data: Record<string, unknown>,
    querystring?: Record<string, unknown>
  ): Promise<WorkflowAPIResponse | WorkflowAPIErrorResponse> {
    const { baseUrl } = this;
    const response = await fetch(`${baseUrl}${buildRequestQuery(querystring)}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: config.getDefaultHeaders(),
    })
      .then(handleFetchResponse)
      .catch(handleError);
    return response.json();
  }
}
