// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';


import * as React from 'react';
import exchangeApi, { type CRUD } from './services/exchangeApi';
import SelectCurrencyPair from './components/SelectCurrencyPair';
import {
  type Currencies,
  type CurrencyPair,
} from './types';
import { isUndef } from './utils/misc';

import {
  ExchangeWidgetStyled,
  ExchangeWidgetPanelStyled,
  ExchangeWidgetPairStyled,
  ExchangeWidgetPairBoxStyled,
} from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './constants';

type Props = {
  defaultPair: CurrencyPair,
  pair: ?CurrencyPair,
  serviceApiConfig: {
    appID: string,
  },
};

type State = {
  currencies: Currencies,
  exchangeRate: number,
  choicePairVisible: boolean,
  pair: CurrencyPair,
};

class ExchangeWidget extends React.Component<Props, State> {
  static defaultProps = {
    defaultPair: ['USD', 'USD'],
    pair: void 0,
    serviceApiConfig: {
      appID: '',
    },
  }

  constructor(props: Props) {
    super(props);

    this._connection = exchangeApi(props.serviceApiConfig.appID);
    this._currenciesConnection = this._connection('currencies');
    this._latestExchangeConnection = this._connection('latest');
  }

  state = {
    currencies: {},
    pair: isUndef(this.props.pair)
      ? this.props.defaultPair
      : this.props.pair,
    exchangeRate: 1,
    choicePairVisible: false,
  };

  componentDidMount() {
    this._currenciesConnection.read()
      .then((currencies: { data: Currencies}): void => {
        this.setState({
          currencies: Object.keys(currencies.data),
        });
      });
  }

  _connection: string => Function;
  _currenciesConnection: string => CRUD;
  _latestExchangeConnection: string => CRUD;

  _handleShowCurrencyPairModal = () => {
    this.setState({
      choicePairVisible: true,
    });
  }

  _handleChangeCurrencyPair = ({ value }: CurrencyPair) => {
    this._latestExchangeConnection.read({
      base: value[CURRENCY_SOURCE_PAIR_INDEX],
    }).then(data => {
      this.setState({
        pair: value,
        exchangeRate: data.data.rates[value[CURRENCY_TARGET_PAIR_INDEX]],
        choicePairVisible: false,
      });
    });
  }

  _handleCancelChoiceCurrencyPair = () => {
    this.setState({
      choicePairVisible: false,
    });
  }

  _renderCurrenciesPairSelect() {
    const { currencies, choicePairVisible, pair } = this.state;

    if (!currencies.length || !choicePairVisible)
      return null;

    return (
      <SelectCurrencyPair
        currencies={currencies}
        defaultPair={pair}
        onChange={this._handleChangeCurrencyPair}
        onCancel={this._handleCancelChoiceCurrencyPair}
      />
    );
  }

  _renderPair() {
    const { exchangeRate, pair } = this.state;

    if (!pair)
      return null;

    const pairExchange =
      `1 ${pair[CURRENCY_SOURCE_PAIR_INDEX]} =
        ${exchangeRate} ${pair[CURRENCY_TARGET_PAIR_INDEX]}`;

    return (
      <ExchangeWidgetPairBoxStyled>
        <ExchangeWidgetPairStyled onClick={this._handleShowCurrencyPairModal}>
          {pairExchange}
        </ExchangeWidgetPairStyled>
      </ExchangeWidgetPairBoxStyled>
    );
  }

  render() {
    const { choicePairVisible } = this.state;

    const currenciesPair = this._renderPair(),
      currenciesPairSelect = this._renderCurrenciesPairSelect();

    return (
      <ExchangeWidgetStyled>
        <ExchangeWidgetPanelStyled blur={choicePairVisible}>
          {currenciesPair}
        </ExchangeWidgetPanelStyled>
        {currenciesPairSelect}
      </ExchangeWidgetStyled>
    );
  }
}

ExchangeWidget.displayName = 'ExchangeWidget';

export default ExchangeWidget;
