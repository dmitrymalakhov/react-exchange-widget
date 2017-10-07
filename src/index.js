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

type Pair = {
  label: string,
  value: number,
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
        const permutations = R.compose(R.sequence(R.of), R.flip(R.repeat));
        
        const availableCurrencies = Object.keys(currencies.data),
          mapIndexed = R.addIndex(R.map),
          slasher = R.join('/');

        const availableCurrenciesPair = mapIndexed(
          (item, value) => ({ label: slasher(item), value }),
          permutations(2, availableCurrencies),
        );

        this.setState({
          currencies: currencies.data,
          availableCurrenciesPair,
        });
      });
  }

  _connection: string => Function;
  _currenciesConnection: string => CRUD;

  _renderCurrenciesPairSelect() {
    const { availableCurrenciesPair } = this.state;

    if (!availableCurrenciesPair.length)
      return null;

    const mapToElement = (pair: Pair): React.Element<any> => (
      <div key={pair.value}>
        {pair.label}
      </div>
    );

    const currenciesList = R.map(mapToElement, availableCurrenciesPair);

    return (
      <div>
        { currenciesList }
      </div>
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
