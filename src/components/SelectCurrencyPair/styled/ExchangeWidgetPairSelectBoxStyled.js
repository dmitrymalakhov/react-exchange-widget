// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const ExchangeWidgetPairSelectBoxStyled = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  border-top: 1px solid rgb(217, 217, 217);
  border-right: 1px solid rgb(217, 217, 217);
  border-bottom: none;
  border-left: 1px solid rgb(217, 217, 217);
  border-image: initial;
`;

ExchangeWidgetPairSelectBoxStyled.displayName =
  'ExchangeWidgetPairSelectBoxStyled';

export default ExchangeWidgetPairSelectBoxStyled;
