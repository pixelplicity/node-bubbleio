import { BubbleConfig } from './types';

let globalConfig: BubbleConfig = {} as BubbleConfig;

const getConfig = (
  obj: Record<string, unknown> = {},
  prop: string,
  envProp: string
): any => {
  return obj[prop] || process.env[envProp];
};

export const config = {
  set: (newConfig?: Partial<BubbleConfig>) => {
    const domain = getConfig(newConfig as any, 'domain', 'BUBBLE_DOMAIN');
    const apiToken = getConfig(
      newConfig as any,
      'apiToken',
      'BUBBLE_API_TOKEN'
    );
    const isLive = ['true', 'TRUE', true].includes(
      getConfig(newConfig as any, 'isLive', 'BUBBLE_LIVE')
    );
    if (!domain) {
      throw new Error(
        'You must provide a domain as an option (domain) or set a BUBBLE_DOMAIN environment variable'
      );
    }
    if (!apiToken) {
      throw new Error(
        'You must provide an API Token as an option (apiToken) or set a BUBBLE_API_TOKEN environment variable'
      );
    }
    globalConfig = {
      domain,
      apiToken,
      isLive,
    };
  },
  get: (): BubbleConfig => {
    return globalConfig;
  },
  getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${globalConfig.apiToken}`,
    };
  },
  getBaseUrl(): string {
    return `https://${globalConfig.domain}/${
      globalConfig.isLive ? '' : 'version-test/'
    }api/1.1`;
  },
};

export default config;
