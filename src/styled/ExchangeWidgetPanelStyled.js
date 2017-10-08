// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const blur = ({ blur }) => blur
  ? 'filter: blur(5px);'
  : null;

const ExchangeWidgetPanelStyled = styled.div`
    position: relative;
    ${blur}
`;

ExchangeWidgetPanelStyled.displayName = 'ExchangeWidgetPanelStyled';

export default ExchangeWidgetPanelStyled;
