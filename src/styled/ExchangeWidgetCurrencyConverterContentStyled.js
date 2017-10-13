// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const color = ({ theme }) => `
  color: ${theme.textColor};
`;

const ExchangeWidgetCurrencyConverterContentStyled = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  font-family: sans-serif;
  ${color}
`;

ExchangeWidgetCurrencyConverterContentStyled.displayName =
  'ExchangeWidgetCurrencyConverterContentStyled';

export default ExchangeWidgetCurrencyConverterContentStyled;
