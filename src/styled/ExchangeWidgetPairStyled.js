// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const color = ({ theme }) => `
  color: ${theme.textColor};
`;

const border = ({ theme }) => `
  border: 1px solid ${theme.textColor};
`;

const ExchangeWidgetPairStyled = styled.div`
  display: inline-block;
  background: hsla(220,45.7%,36.8%,0.5);
  border-radius: 10px;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  ${color}
  ${border}
`;

ExchangeWidgetPairStyled.displayName = 'ExchangeWidgetPairStyled';

export default ExchangeWidgetPairStyled;
