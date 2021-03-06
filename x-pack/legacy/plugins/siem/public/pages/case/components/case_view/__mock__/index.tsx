/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CaseProps } from '../index';
import { Case } from '../../../../../containers/case/types';

export const caseProps: CaseProps = {
  caseId: '3c4ddcc0-4e99-11ea-9290-35d05cb55c15',
  initialData: {
    closedAt: null,
    closedBy: null,
    id: '3c4ddcc0-4e99-11ea-9290-35d05cb55c15',
    commentIds: ['a357c6a0-5435-11ea-b427-fb51a1fcb7b8'],
    comments: [
      {
        comment: 'Solve this fast!',
        id: 'a357c6a0-5435-11ea-b427-fb51a1fcb7b8',
        createdAt: '2020-02-20T23:06:33.798Z',
        createdBy: {
          fullName: 'Steph Milovic',
          username: 'smilovic',
          email: 'notmyrealemailfool@elastic.co',
        },
        updatedAt: '2020-02-20T23:06:33.798Z',
        updatedBy: {
          username: 'elastic',
        },
        version: 'WzQ3LDFd',
      },
    ],
    createdAt: '2020-02-13T19:44:23.627Z',
    createdBy: { fullName: null, email: 'testemail@elastic.co', username: 'elastic' },
    description: 'Security banana Issue',
    status: 'open',
    tags: ['defacement'],
    title: 'Another horrible breach!!',
    updatedAt: '2020-02-19T15:02:57.995Z',
    updatedBy: {
      username: 'elastic',
    },
    version: 'WzQ3LDFd',
  },
};
export const caseClosedProps: CaseProps = {
  ...caseProps,
  initialData: {
    ...caseProps.initialData,
    closedAt: '2020-02-20T23:06:33.798Z',
    closedBy: {
      username: 'elastic',
    },
    status: 'closed',
  },
};

export const data: Case = {
  ...caseProps.initialData,
};

export const dataClosed: Case = {
  ...caseClosedProps.initialData,
};
