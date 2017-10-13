// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const background = ({ theme }) => `
  background: ${theme.background};
`;

const height = ({ theme }) => `
  height: ${theme.height};
`;

const width = ({ theme }) => `
  width: ${theme.width};
`;

const ExchangeWidgetStyled = styled.div`
  position: relative;
  ${width}
  ${height}
  ${background}
`;

ExchangeWidgetStyled.displayName = 'ExchangeWidgetStyled';

export default ExchangeWidgetStyled;
