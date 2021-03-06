/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { VectorStyle } from './vector_style';
import { DEFAULT_ICON, LABEL_BORDER_SIZES, SYMBOLIZE_AS_TYPES } from '../../../../common/constants';
import {
  COLOR_GRADIENTS,
  COLOR_PALETTES,
  DEFAULT_FILL_COLORS,
  DEFAULT_LINE_COLORS,
} from '../color_utils';
import chrome from 'ui/chrome';

export const MIN_SIZE = 1;
export const MAX_SIZE = 64;
export const DEFAULT_MIN_SIZE = 7; // Make default large enough to fit default label size
export const DEFAULT_MAX_SIZE = 32;
export const DEFAULT_SIGMA = 3;
export const DEFAULT_LABEL_SIZE = 14;
export const DEFAULT_ICON_SIZE = 6;

export const VECTOR_STYLES = {
  SYMBOLIZE_AS: 'symbolizeAs',
  FILL_COLOR: 'fillColor',
  LINE_COLOR: 'lineColor',
  LINE_WIDTH: 'lineWidth',
  ICON: 'icon',
  ICON_SIZE: 'iconSize',
  ICON_ORIENTATION: 'iconOrientation',
  LABEL_TEXT: 'labelText',
  LABEL_COLOR: 'labelColor',
  LABEL_SIZE: 'labelSize',
  LABEL_BORDER_COLOR: 'labelBorderColor',
  LABEL_BORDER_SIZE: 'labelBorderSize',
};

export const LINE_STYLES = [VECTOR_STYLES.LINE_COLOR, VECTOR_STYLES.LINE_WIDTH];
export const POLYGON_STYLES = [
  VECTOR_STYLES.FILL_COLOR,
  VECTOR_STYLES.LINE_COLOR,
  VECTOR_STYLES.LINE_WIDTH,
];

export function getDefaultProperties(mapColors = []) {
  return {
    ...getDefaultStaticProperties(mapColors),
    [VECTOR_STYLES.SYMBOLIZE_AS]: {
      options: {
        value: SYMBOLIZE_AS_TYPES.CIRCLE,
      },
    },
    [VECTOR_STYLES.LABEL_BORDER_SIZE]: {
      options: {
        size: LABEL_BORDER_SIZES.SMALL,
      },
    },
  };
}

export function getDefaultStaticProperties(mapColors = []) {
  // Colors must be state-aware to reduce unnecessary incrementation
  const lastColor = mapColors.pop();
  const nextColorIndex = (DEFAULT_FILL_COLORS.indexOf(lastColor) + 1) % DEFAULT_FILL_COLORS.length;
  const nextFillColor = DEFAULT_FILL_COLORS[nextColorIndex];
  const nextLineColor = DEFAULT_LINE_COLORS[nextColorIndex];

  const isDarkMode = chrome.getUiSettingsClient().get('theme:darkMode', false);

  return {
    [VECTOR_STYLES.ICON]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        value: DEFAULT_ICON,
      },
    },
    [VECTOR_STYLES.FILL_COLOR]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        color: nextFillColor,
      },
    },
    [VECTOR_STYLES.LINE_COLOR]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        color: nextLineColor,
      },
    },
    [VECTOR_STYLES.LINE_WIDTH]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        size: 1,
      },
    },
    [VECTOR_STYLES.ICON_SIZE]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        size: DEFAULT_ICON_SIZE,
      },
    },
    [VECTOR_STYLES.ICON_ORIENTATION]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        orientation: 0,
      },
    },
    [VECTOR_STYLES.LABEL_TEXT]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        value: '',
      },
    },
    [VECTOR_STYLES.LABEL_COLOR]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        color: isDarkMode ? '#FFFFFF' : '#000000',
      },
    },
    [VECTOR_STYLES.LABEL_SIZE]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        size: DEFAULT_LABEL_SIZE,
      },
    },
    [VECTOR_STYLES.LABEL_BORDER_COLOR]: {
      type: VectorStyle.STYLE_TYPE.STATIC,
      options: {
        color: isDarkMode ? '#000000' : '#FFFFFF',
      },
    },
  };
}

export function getDefaultDynamicProperties() {
  return {
    [VECTOR_STYLES.ICON]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        iconPaletteId: 'filledShapes',
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
        },
      },
    },
    [VECTOR_STYLES.FILL_COLOR]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        color: COLOR_GRADIENTS[0].value,
        colorCategory: COLOR_PALETTES[0].value,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.LINE_COLOR]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        color: undefined,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.LINE_WIDTH]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        minSize: 1,
        maxSize: 10,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.ICON_SIZE]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        minSize: DEFAULT_MIN_SIZE,
        maxSize: DEFAULT_MAX_SIZE,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.ICON_ORIENTATION]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.LABEL_TEXT]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        field: undefined,
      },
    },
    [VECTOR_STYLES.LABEL_COLOR]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        color: COLOR_GRADIENTS[0].value,
        colorCategory: COLOR_PALETTES[0].value,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.LABEL_SIZE]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        minSize: DEFAULT_MIN_SIZE,
        maxSize: DEFAULT_MAX_SIZE,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
    [VECTOR_STYLES.LABEL_BORDER_COLOR]: {
      type: VectorStyle.STYLE_TYPE.DYNAMIC,
      options: {
        color: COLOR_GRADIENTS[0].value,
        colorCategory: COLOR_PALETTES[0].value,
        field: undefined,
        fieldMetaOptions: {
          isEnabled: true,
          sigma: DEFAULT_SIGMA,
        },
      },
    },
  };
}
