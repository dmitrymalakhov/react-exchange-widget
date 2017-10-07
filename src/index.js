// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';


import * as React from 'react';
import R from 'ramda';
import exchangeApi, { type CRUD } from './services/exchangeApi';
import ExchangeWidgetStyled from './styled/ExchangeWidgetStyled';

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
  availableCurrenciesPair: [string],
  selectPair: ?string,
};

class ExchangeWidget extends React.Component<Props, State> {
  static defaultProps = {
    defaultPair: ['USD', 'EUR'],
    defaultValue: [0, 0],
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
    availableCurrenciesPair: ['USD/EUR'],
    selectPair: void 0,
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

  _renderCurrenciesPairSelect() {
    const { currencies } = this.state;

    if (!currencies.length)
      return null;

    const mapToElement = (currency: string): React.Element<any> => (
      <li key={currency}>
        {currency}
      </li>
    );

    const currenciesList = R.map(mapToElement, currencies);

    return (
      <ul>
        { currenciesList }
      </ul>
    );
  }

  render() {
    const currenciesPairList = this._renderCurrenciesPairSelect();

    return (
      <ExchangeWidgetStyled>
        {currenciesPairList}
      </ExchangeWidgetStyled>
    );
  }
}

ExchangeWidget.displayName = 'ExchangeWidget';

export default ExchangeWidget;
