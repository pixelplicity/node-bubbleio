import config from './config';
import DataAPI from './data-api';
import WorkflowAPI from './workflow-api';
import { BubbleConfig } from './types';

const BubbleIO = {
  init: (initialConfig?: Partial<BubbleConfig>) => {
    config.set(initialConfig);
  },
  DataAPI,
  WorkflowAPI,
};

export default BubbleIO;
