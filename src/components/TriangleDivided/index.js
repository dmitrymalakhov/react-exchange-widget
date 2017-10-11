// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import * as React from 'react';

import {
  ExchangeWidgetTriangleDividedStyled,
  ExchangeWidgetTriangleDividedLeftStyled,
  ExchangeWidgetTriangleDividedRightStyled,
} from './styled';

const TriangleDivided = () => (
  <ExchangeWidgetTriangleDividedStyled>
    <ExchangeWidgetTriangleDividedLeftStyled />
    <ExchangeWidgetTriangleDividedRightStyled />
  </ExchangeWidgetTriangleDividedStyled>
);

TriangleDivided.displayName = 'TriangleDivided';

export default TriangleDivided;
