import DataAPI from './data-api';
import { BubbleConfig } from './types';
declare const BubbleIO: {
    init: (initialConfig?: Partial<BubbleConfig> | undefined) => void;
    DataAPI: typeof DataAPI;
};
export default BubbleIO;
