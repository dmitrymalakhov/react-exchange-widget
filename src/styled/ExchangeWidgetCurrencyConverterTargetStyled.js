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
}


const ExchangeWidgetCurrencyConverterTargetStyled = styled.div`
    width: 180px;
    color: white;
    text-align: right;
    overflow: auto;
    ${fontSize}
`;

ExchangeWidgetCurrencyConverterTargetStyled.displayName =
  'ExchangeWidgetCurrencyConverterTargetStyled';

export default ExchangeWidgetCurrencyConverterTargetStyled;
