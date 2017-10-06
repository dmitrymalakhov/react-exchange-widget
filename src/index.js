// @flow

import React, { Component } from 'react';
import ExchangeWidgetStyled from './styled/ExchangeWidgetStyled';

type Props = {
  defaultPair: Array<?string>,
};

class ExchangeWidget extends Component<Props> {
  static defaultProps = {
    defaultPair: ['USD', 'EUR'],
  }

  componentWillMount() {

  }

  render() {
    return (
      <ExchangeWidgetStyled>
        {this.props.defaultPair}
      </ExchangeWidgetStyled>
    );
  }
}

ExchangeWidget.displayName = 'ExchangeWidget';

export default ExchangeWidget;
