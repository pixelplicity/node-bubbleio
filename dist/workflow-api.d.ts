import { WorkflowAPIErrorResponse, WorkflowAPIResponse, WorkflowAPIOptions } from './types';
export default class WorkflowAPI {
    _name: string;
    constructor(options: WorkflowAPIOptions);
    private get baseUrl();
    send(data: Record<string, unknown>, querystring?: Record<string, unknown>): Promise<WorkflowAPIResponse | WorkflowAPIErrorResponse>;
}
