/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { getElasticsearchMetricQuery } from '../../../../plugins/infra/server/lib/alerting/metric_threshold/metric_threshold_executor';
import { MetricExpressionParams } from '../../../../plugins/infra/server/lib/alerting/metric_threshold/types';

import { FtrProviderContext } from '../../ftr_provider_context';

export default function({ getService }: FtrProviderContext) {
  const client = getService('legacyEs');
  const index = 'test-index';
  const baseParams = {
    metric: 'test.metric',
    timeUnit: 'm',
    timeSize: 5,
  };
  describe('Metrics Threshold Alerts', () => {
    before(async () => {
      await client.index({
        index,
        body: {},
      });
    });
    const aggs = ['avg', 'min', 'max', 'rate', 'cardinality', 'count'];

    describe('querying the entire infrastructure', () => {
      for (const aggType of aggs) {
        it(`should work with the ${aggType} aggregator`, async () => {
          const searchBody = getElasticsearchMetricQuery({
            ...baseParams,
            aggType,
          } as MetricExpressionParams);
          const result = await client.search({
            index,
            body: searchBody,
          });
          expect(result.error).to.not.be.ok();
          expect(result.hits).to.be.ok();
        });
      }
      it('should work with a filterQuery', async () => {
        const searchBody = getElasticsearchMetricQuery(
          {
            ...baseParams,
            aggType: 'avg',
          } as MetricExpressionParams,
          undefined,
          '{"bool":{"should":[{"match_phrase":{"agent.hostname":"foo"}}],"minimum_should_match":1}}'
        );
        const result = await client.search({
          index,
          body: searchBody,
        });
        expect(result.error).to.not.be.ok();
        expect(result.hits).to.be.ok();
      });
    });
    describe('querying with a groupBy parameter', () => {
      for (const aggType of aggs) {
        it(`should work with the ${aggType} aggregator`, async () => {
          const searchBody = getElasticsearchMetricQuery(
            {
              ...baseParams,
              aggType,
            } as MetricExpressionParams,
            'agent.id'
          );
          const result = await client.search({
            index,
            body: searchBody,
          });
          expect(result.error).to.not.be.ok();
          expect(result.hits).to.be.ok();
        });
      }
      it('should work with a filterQuery', async () => {
        const searchBody = getElasticsearchMetricQuery(
          {
            ...baseParams,
            aggType: 'avg',
          } as MetricExpressionParams,
          'agent.id',
          '{"bool":{"should":[{"match_phrase":{"agent.hostname":"foo"}}],"minimum_should_match":1}}'
        );
        const result = await client.search({
          index,
          body: searchBody,
        });
        expect(result.error).to.not.be.ok();
        expect(result.hits).to.be.ok();
      });
    });
  });
}
