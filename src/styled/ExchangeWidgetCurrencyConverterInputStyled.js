// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const ExchangeWidgetCurrencyConverterInputStyled = styled.input`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  font-size: 40px;
  width: 180px;
  color: white;
  text-align: right;

  &:hover,
  &:focus,
  &:active {
    outline: none;
  }
`;

ExchangeWidgetCurrencyConverterInputStyled.displayName =
  'ExchangeWidgetCurrencyConverterInputStyled';

export default ExchangeWidgetCurrencyConverterInputStyled;
