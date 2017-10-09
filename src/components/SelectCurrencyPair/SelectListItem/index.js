// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';


import React, { PureComponent } from 'react';
import { ExchangeWidgetPairSelectListItemStyled } from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './../../../constants';

type Props = {
  active: boolean,
  label: string,
  value: string,
  index: CURRENCY_SOURCE_PAIR_INDEX | CURRENCY_TARGET_PAIR_INDEX,
  onClick: ({ index: number, value: string }) => void,
};

class SelectListItem extends PureComponent<Props> {
  static defaultProps = {
    active: false,
    label: 'USD',
    value: 'USD',
    index: CURRENCY_SOURCE_PAIR_INDEX,
    onClick: () => {},
  }

  _handleClick = () => {
    const { index, value, onClick } = this.props;

    onClick({
      index,
      value,
    });
  }

  render() {
    const { active, label } = this.props;

    return (
      <ExchangeWidgetPairSelectListItemStyled
        active={active}
        onClick={this._handleClick}
      >
        {label}
      </ExchangeWidgetPairSelectListItemStyled>
    );
  }
}

SelectListItem.displayName = 'SelectListItem';

export default SelectListItem;
