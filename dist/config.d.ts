import { BubbleConfig } from './types';
export declare const config: {
    set: (newConfig?: Partial<BubbleConfig> | undefined) => void;
    get: () => BubbleConfig;
    getDefaultHeaders(): Record<string, string>;
    getBaseUrl(): string;
};
export default config;
