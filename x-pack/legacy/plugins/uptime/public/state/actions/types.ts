/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Action } from 'redux-actions';

export interface AsyncAction {
  get: (payload?: any) => Action<any>;
  success: (payload?: any) => Action<any>;
  fail: (payload?: any) => Action<any>;
}

export interface QueryParams {
  monitorId: string;
  dateStart: string;
  dateEnd: string;
  filters?: string;
  statusFilter?: string;
  location?: string;
}

export interface MonitorDetailsActionPayload {
  monitorId: string;
  dateStart: string;
  dateEnd: string;
  location?: string;
}
