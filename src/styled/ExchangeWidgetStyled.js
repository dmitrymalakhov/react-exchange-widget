// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const blur = ({ blur }) => blur
  ? 'filter: blur(5px);'
  : null;

const ExchangeWidgetStyled = styled.div`
  position: relative;
  height: 100%;
  ${blur}
`;

ExchangeWidgetStyled.displayName = 'ExchangeWidgetStyled';

export default ExchangeWidgetStyled;
