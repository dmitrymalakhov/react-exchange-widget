// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const fontSize = ({ value }) => {
  let currentFornSize = 40;

  if (value) {
    const valueLength = value.toString().length;

    if (valueLength > 7)
      currentFornSize = 30;
    
    if (valueLength > 10)
      currentFornSize = 20;
  }
  
  return `
    font-size: ${currentFornSize}px;
  `;
};

const color = ({ theme }) => `
  color: ${theme.textColor};
`;

const ExchangeWidgetCurrencyConverterTargetStyled = styled.div`
  width: 180px;
  text-align: right;
  overflow: auto;
  ${color}
  ${fontSize}
`;

ExchangeWidgetCurrencyConverterTargetStyled.displayName =
  'ExchangeWidgetCurrencyConverterTargetStyled';

export default ExchangeWidgetCurrencyConverterTargetStyled;
