import DataAPI from './data-api';
import WorkflowAPI from './workflow-api';
import { BubbleConfig } from './types';
declare const BubbleIO: {
    init: (initialConfig?: Partial<BubbleConfig> | undefined) => void;
    DataAPI: typeof DataAPI;
    WorkflowAPI: typeof WorkflowAPI;
};
export default BubbleIO;
