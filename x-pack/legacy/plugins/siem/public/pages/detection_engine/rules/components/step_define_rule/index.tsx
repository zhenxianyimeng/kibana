/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  EuiButtonEmpty,
  EuiHorizontalRule,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiButton,
} from '@elastic/eui';
import { isEmpty } from 'lodash/fp';
import React, { FC, memo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import deepEqual from 'fast-deep-equal';

import { IIndexPattern } from '../../../../../../../../../../src/plugins/data/public';
import { useFetchIndexPatterns } from '../../../../../containers/detection_engine/rules';
import { DEFAULT_INDEX_KEY } from '../../../../../../common/constants';
import { useUiSetting$ } from '../../../../../lib/kibana';
import { setFieldValue, isMlRule } from '../../helpers';
import * as RuleI18n from '../../translations';
import { DefineStepRule, RuleStep, RuleStepProps } from '../../types';
import { StepRuleDescription } from '../description_step';
import { QueryBarDefineRule } from '../query_bar';
import { SelectRuleType } from '../select_rule_type';
import { AnomalyThresholdSlider } from '../anomaly_threshold_slider';
import { MlJobSelect } from '../ml_job_select';
import { StepContentWrapper } from '../step_content_wrapper';
import {
  Field,
  Form,
  FormDataProvider,
  getUseField,
  UseField,
  useForm,
  FormSchema,
} from '../../../../../shared_imports';
import { schema } from './schema';
import * as i18n from './translations';
import { filterRuleFieldsForType, RuleFields } from '../../create/helpers';

const CommonUseField = getUseField({ component: Field });

interface StepDefineRuleProps extends RuleStepProps {
  defaultValues?: DefineStepRule | null;
}

const stepDefineDefaultValue: DefineStepRule = {
  anomalyThreshold: 50,
  index: [],
  isNew: true,
  machineLearningJobId: '',
  ruleType: 'query',
  queryBar: {
    query: { query: '', language: 'kuery' },
    filters: [],
    saved_id: undefined,
  },
};

const MyLabelButton = styled(EuiButtonEmpty)`
  height: 18px;
  font-size: 12px;

  .euiIcon {
    width: 14px;
    height: 14px;
  }
`;

MyLabelButton.defaultProps = {
  flush: 'right',
};

const getStepDefaultValue = (
  indicesConfig: string[],
  defaultValues: DefineStepRule | null
): DefineStepRule => {
  if (defaultValues != null) {
    return {
      ...defaultValues,
      isNew: false,
    };
  } else {
    return {
      ...stepDefineDefaultValue,
      index: indicesConfig != null ? indicesConfig : [],
    };
  }
};

const StepDefineRuleComponent: FC<StepDefineRuleProps> = ({
  addPadding = false,
  defaultValues,
  descriptionColumns = 'singleSplit',
  isReadOnlyView,
  isLoading,
  isUpdateView = false,
  setForm,
  setStepData,
}) => {
  const [openTimelineSearch, setOpenTimelineSearch] = useState(false);
  const [localUseIndicesConfig, setLocalUseIndicesConfig] = useState(false);
  const [localIsMlRule, setIsMlRule] = useState(false);
  const [indicesConfig] = useUiSetting$<string[]>(DEFAULT_INDEX_KEY);
  const [mylocalIndicesConfig, setMyLocalIndicesConfig] = useState(
    defaultValues != null ? defaultValues.index : indicesConfig ?? []
  );
  const [
    { browserFields, indexPatterns: indexPatternQueryBar, isLoading: indexPatternLoadingQueryBar },
  ] = useFetchIndexPatterns(mylocalIndicesConfig);
  const [myStepData, setMyStepData] = useState<DefineStepRule>(
    getStepDefaultValue(indicesConfig, null)
  );

  const { form } = useForm({
    defaultValue: myStepData,
    options: { stripEmptyFields: false },
    schema,
  });
  const clearErrors = useCallback(() => form.reset({ resetValues: false }), [form]);

  const onSubmit = useCallback(async () => {
    if (setStepData) {
      setStepData(RuleStep.defineRule, null, false);
      const { isValid, data } = await form.submit();
      if (isValid && setStepData) {
        setStepData(RuleStep.defineRule, data, isValid);
        setMyStepData({ ...data, isNew: false } as DefineStepRule);
      }
    }
  }, [form]);

  useEffect(() => {
    if (indicesConfig != null && defaultValues != null) {
      const myDefaultValues = getStepDefaultValue(indicesConfig, defaultValues);
      if (!deepEqual(myDefaultValues, myStepData)) {
        setMyStepData(myDefaultValues);
        setLocalUseIndicesConfig(deepEqual(myDefaultValues.index, indicesConfig));
        setFieldValue(form, schema, myDefaultValues);
      }
    }
  }, [defaultValues, indicesConfig]);

  useEffect(() => {
    if (setForm != null) {
      setForm(RuleStep.defineRule, form);
    }
  }, [form]);

  const handleResetIndices = useCallback(() => {
    const indexField = form.getFields().index;
    indexField.setValue(indicesConfig);
  }, [form, indicesConfig]);

  const handleOpenTimelineSearch = useCallback(() => {
    setOpenTimelineSearch(true);
  }, []);

  const handleCloseTimelineSearch = useCallback(() => {
    setOpenTimelineSearch(false);
  }, []);

  return isReadOnlyView ? (
    <StepContentWrapper data-test-subj="definitionRule" addPadding={addPadding}>
      <StepRuleDescription
        columns={descriptionColumns}
        indexPatterns={indexPatternQueryBar as IIndexPattern}
        schema={filterRuleFieldsForType(schema as FormSchema & RuleFields, myStepData.ruleType)}
        data={filterRuleFieldsForType(myStepData, myStepData.ruleType)}
      />
    </StepContentWrapper>
  ) : (
    <>
      <StepContentWrapper addPadding={!isUpdateView}>
        <Form form={form} data-test-subj="stepDefineRule">
          <UseField
            path="ruleType"
            component={SelectRuleType}
            componentProps={{
              isReadOnly: isUpdateView,
            }}
          />
          <EuiFormRow fullWidth style={{ display: localIsMlRule ? 'none' : 'flex' }}>
            <>
              <CommonUseField
                path="index"
                config={{
                  ...schema.index,
                  labelAppend: !localUseIndicesConfig ? (
                    <MyLabelButton onClick={handleResetIndices} iconType="refresh">
                      {i18n.RESET_DEFAULT_INDEX}
                    </MyLabelButton>
                  ) : null,
                }}
                componentProps={{
                  idAria: 'detectionEngineStepDefineRuleIndices',
                  'data-test-subj': 'detectionEngineStepDefineRuleIndices',
                  euiFieldProps: {
                    fullWidth: true,
                    isDisabled: isLoading,
                    placeholder: '',
                  },
                }}
              />
              <UseField
                path="queryBar"
                config={{
                  ...schema.queryBar,
                  labelAppend: (
                    <MyLabelButton onClick={handleOpenTimelineSearch}>
                      {i18n.IMPORT_TIMELINE_QUERY}
                    </MyLabelButton>
                  ),
                }}
                component={QueryBarDefineRule}
                componentProps={{
                  browserFields,
                  loading: indexPatternLoadingQueryBar,
                  idAria: 'detectionEngineStepDefineRuleQueryBar',
                  indexPattern: indexPatternQueryBar,
                  isDisabled: isLoading,
                  isLoading: indexPatternLoadingQueryBar,
                  dataTestSubj: 'detectionEngineStepDefineRuleQueryBar',
                  openTimelineSearch,
                  onCloseTimelineSearch: handleCloseTimelineSearch,
                }}
              />
            </>
          </EuiFormRow>
          <EuiFormRow fullWidth style={{ display: localIsMlRule ? 'flex' : 'none' }}>
            <>
              <UseField path="machineLearningJobId" component={MlJobSelect} />
              <UseField path="anomalyThreshold" component={AnomalyThresholdSlider} />
            </>
          </EuiFormRow>
          <FormDataProvider pathsToWatch={['index', 'ruleType']}>
            {({ index, ruleType }) => {
              if (index != null) {
                if (deepEqual(index, indicesConfig) && !localUseIndicesConfig) {
                  setLocalUseIndicesConfig(true);
                }
                if (!deepEqual(index, indicesConfig) && localUseIndicesConfig) {
                  setLocalUseIndicesConfig(false);
                }
                if (index != null && !isEmpty(index) && !deepEqual(index, mylocalIndicesConfig)) {
                  setMyLocalIndicesConfig(index);
                }
              }

              if (isMlRule(ruleType) && !localIsMlRule) {
                setIsMlRule(true);
                clearErrors();
              } else if (!isMlRule(ruleType) && localIsMlRule) {
                setIsMlRule(false);
                clearErrors();
              }

              return null;
            }}
          </FormDataProvider>
        </Form>
      </StepContentWrapper>
      {!isUpdateView && (
        <>
          <EuiHorizontalRule margin="m" />
          <EuiFlexGroup
            alignItems="center"
            justifyContent="flexEnd"
            gutterSize="xs"
            responsive={false}
          >
            <EuiFlexItem grow={false}>
              <EuiButton fill onClick={onSubmit} isDisabled={isLoading} data-test-subj="continue">
                {RuleI18n.CONTINUE}
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
      )}
    </>
  );
};

export const StepDefineRule = memo(StepDefineRuleComponent);
