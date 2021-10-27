import fetch from 'node-fetch';
import omit from 'lodash.omit';

let globalConfig = {};

const getConfig = (obj = {}, prop, envProp) => {
  return obj[prop] || process.env[envProp];
};

const config = {
  set: newConfig => {
    const domain = getConfig(newConfig, 'domain', 'BUBBLE_DOMAIN');
    const apiToken = getConfig(newConfig, 'apiToken', 'BUBBLE_API_TOKEN');
    const isLive = ['true', 'TRUE', true].includes(getConfig(newConfig, 'isLive', 'BUBBLE_LIVE'));

    if (!domain) {
      throw new Error('You must provide a domain as an option (domain) or set a BUBBLE_DOMAIN environment variable');
    }

    if (!apiToken) {
      throw new Error('You must provide an API Token as an option (apiToken) or set a BUBBLE_API_TOKEN environment variable');
    }

    globalConfig = {
      domain,
      apiToken,
      isLive
    };
  },
  get: () => {
    return globalConfig;
  },

  getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${globalConfig.apiToken}`
    };
  },

  getBaseUrl() {
    return `https://${globalConfig.domain}/${globalConfig.isLive ? '' : 'version-test'}/api/1.1/`;
  }

};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

const handleError = error => {
  console.error(error);
  throw error;
};

const handleFetchResponse = async response => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw errorText;
  }

  return response;
};

function buildSearchQuery(query) {
  if (!query) {
    return '';
  }

  const queryString = [];

  if (query != null && query.constraints) {
    queryString.push(`constraints=${encodeURIComponent(JSON.stringify(query.constraints))}`);
  }

  if (query != null && query.limit) {
    queryString.push(`limit=${query.limit}`);
  }

  if (query != null && query.cursor) {
    queryString.push(`cursor=${query.cursor}`);
  }

  if (query != null && query.sort_field) {
    queryString.push(`sort_field=${query.sort_field}`);
  }

  if (query != null && query.descending) {
    queryString.push(`descending=${query.descending}`);
  }

  if (query != null && query.additional_sort_fields) {
    queryString.push(`additional_sort_fields=${encodeURIComponent(JSON.stringify(query.additional_sort_fields))}`);
  }

  return queryString.length === 0 ? '' : `?${queryString.join('&')}`;
}

const sanitizeData = data => {
  return omit(data, ['_id', 'Slug', 'Created By', 'Created Date', 'Modified Date', '_type']);
};

class DataAPI {
  constructor(args) {
    this['Created Date'] = void 0;
    this['Created By'] = void 0;
    this['Modified Date'] = void 0;
    this['Slug'] = void 0;
    this._id = void 0;
    Object.assign(this, args);
  }

  get baseUrl() {
    return `${config.getBaseUrl()}/obj/${this._type}`;
  }

  static async find(query) {
    const {
      baseUrl
    } = new this({});
    const response = await fetch(`${baseUrl}${buildSearchQuery(query)}`, {
      headers: config.getDefaultHeaders()
    }).then(handleFetchResponse).catch(handleError);
    const responseData = await response.json();
    return _extends({}, responseData.response, {
      results: responseData.response.results.map(data => new this(data))
    });
  }

  static async get(id) {
    const {
      baseUrl
    } = new this({});
    const response = await fetch(`${baseUrl}/${id}`, {
      headers: config.getDefaultHeaders()
    }).then(handleFetchResponse).catch(handleError);
    const responseData = await response.json();
    return new this(responseData.response);
  }

  static async create(data) {
    const {
      baseUrl
    } = new this({});
    const response = await fetch(`${baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(sanitizeData(data)),
      headers: config.getDefaultHeaders()
    }).then(handleFetchResponse).catch(handleError);
    const responseData = await response.json();
    return new this({
      _id: responseData.id
    }).refresh();
  }

  static async bulkCreate(data) {
    const {
      baseUrl
    } = new this({});
    const response = await fetch(`${baseUrl}/bulk`, {
      method: 'POST',
      body: `${data.map(d => JSON.stringify(sanitizeData(d))).join('\n')}`,
      headers: _extends({}, config.getDefaultHeaders(), {
        'Content-Type': 'text/plain'
      })
    }).then(handleFetchResponse).catch(handleError);
    const responseData = await response.text();
    const results = JSON.parse(`[${responseData.replace(/\n/g, ',')}]`);
    const records = await Promise.all(results.map(r => new this({
      _id: r.id
    }).refresh()));
    return records;
  }

  async refresh() {
    const {
      baseUrl
    } = this;

    if (!this._id) {
      throw new Error('Cannot call refresh on an object with no _id');
    }

    const response = await fetch(`${baseUrl}/${this._id}`, {
      headers: config.getDefaultHeaders()
    }).then(handleFetchResponse).catch(handleError);
    const responseData = await response.json();
    Object.assign(this, responseData.response);
    return this;
  }

  async save() {
    const {
      _id,
      baseUrl
    } = this;
    const isNew = !_id;
    const method = isNew ? 'POST' : 'PATCH';
    const response = await fetch(`${baseUrl}${isNew ? '' : '/' + _id}`, {
      method,
      body: JSON.stringify(sanitizeData(this)),
      headers: config.getDefaultHeaders()
    }).then(handleFetchResponse).catch(handleError);

    if (isNew) {
      const responseData = await response.json();
      this._id = responseData.id;
    }

    return this.refresh();
  }

  async delete() {
    const {
      _id,
      baseUrl
    } = this;

    if (!_id) {
      throw new Error('Cannot call delete on an object with no _id');
    }

    const response = await fetch(`${baseUrl}/${_id}`, {
      method: 'DELETE',
      headers: config.getDefaultHeaders()
    }).then(handleFetchResponse).catch(handleError);
    return response ? response.ok : false;
  }

}

const BubbleIO = {
  init: initialConfig => {
    config.set(initialConfig);
  },
  DataAPI // Workflow: {},

};

export { BubbleIO as default };
//# sourceMappingURL=index.module.js.map
