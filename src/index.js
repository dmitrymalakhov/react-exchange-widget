// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';


import * as React from 'react';
import R from 'ramda';
import exchangeApi, { type CRUD } from './services/exchangeApi';
import { isUndef } from './utils/misc';

import SelectListItem from './components/SelectListItem';

import {
  ExchangeWidgetStyled,
  ExchangeWidgetPanelStyled,
  ExchangeWidgetPairStyled,
  ExchangeWidgetPairBoxStyled,
  ExchangeWidgetPairSelectBoxStyled,
  ExchangeWidgetPairSelectStyled,
  ExchangeWidgetPairSelectListStyled,
  ExchangeWidgetPairSelectListBoxStyled,
  ExchangeWidgetPairSelectButtonBoxStyled,
  ExchangeWidgetPairSelectButtonStyled,
} from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './constants';

type Props = {
  defaultPair: [string, string],
  defaultValue: [number, number],
  pair: ?[string, string],
  value: ?[number, number],
  serviceApiConfig: {
    appID: string,
  },
};

type Currencies = {
  [string]: string,
};

type State = {
  currencies: Currencies,
  exchangeRate: number,
  choicePairVisible: boolean,
  pair: [string, string],
  value: [number, number],
};

class ExchangeWidget extends React.Component<Props, State> {
  static defaultProps = {
    defaultPair: ['USD', 'USD'],
    defaultValue: [1, 1],
    pair: void 0,
    value: void 0,
    serviceApiConfig: {
      appID: '',
    },
  }

  constructor(props: Props) {
    super(props);

    this._connection = exchangeApi(props.serviceApiConfig.appID);
    this._currenciesConnection = this._connection('currencies');
  }

  state = {
    currencies: {},
    pair: isUndef(this.props.pair)
      ? this.props.defaultPair
      : this.props.pair,
    value: isUndef(this.props.value)
      ? this.props.defaultValue
      : this.props.value,
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

  _handleChangePair = () => {
    this.setState({
      choicePairVisible: true,
    });
  }

  _handleClickPair = ({ index, value }) => {
    const mapIndexed = R.addIndex(R.map);

    this.setState({
      pair: mapIndexed(
        (item, idx) => index === idx ? value : item,
        this.state.pair,
      ),
    });
  }

  _renderCurrenciesPairSelect() {
    const { currencies, choicePairVisible, pair } = this.state;

    if (!currencies.length || !choicePairVisible)
      return null;

    const mapToElement = (currencyNum: number) =>
      (currency: string): React.Element<any> => (
        <SelectListItem
          key={`${currencyNum}${currency}`}
          index={currencyNum}
          label={currency}
          value={currency}
          active={pair[currencyNum] === currency}
          onClick={this._handleClickPair}
        />
      );

    const currenciesListSource = R.map(
      mapToElement(CURRENCY_SOURCE_PAIR_INDEX),
      currencies,
    );

    const currenciesListTarget = R.map(
      mapToElement(CURRENCY_TARGET_PAIR_INDEX),
      currencies,
    );

    return (
      <ExchangeWidgetPairSelectBoxStyled>
        <ExchangeWidgetPairSelectListBoxStyled>
          <ExchangeWidgetPairSelectStyled>
            <ExchangeWidgetPairSelectListStyled>
              { currenciesListSource }
            </ExchangeWidgetPairSelectListStyled>
          </ExchangeWidgetPairSelectStyled>
          <ExchangeWidgetPairSelectStyled>
            <ExchangeWidgetPairSelectListStyled>
              { currenciesListTarget }
            </ExchangeWidgetPairSelectListStyled>
          </ExchangeWidgetPairSelectStyled>
        </ExchangeWidgetPairSelectListBoxStyled>
        <ExchangeWidgetPairSelectButtonBoxStyled>
          <ExchangeWidgetPairSelectButtonStyled>
            Update
          </ExchangeWidgetPairSelectButtonStyled>
        </ExchangeWidgetPairSelectButtonBoxStyled>
      </ExchangeWidgetPairSelectBoxStyled>
    );
  }

  _renderPair() {
    const { exchangeRate, pair } = this.state;

    if (!pair)
      return null;

    const pairExchange = `1 ${pair[0]} = ${exchangeRate} ${pair[1]}`;

    return (
      <ExchangeWidgetPairBoxStyled>
        <ExchangeWidgetPairStyled onClick={this._handleChangePair}>
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
