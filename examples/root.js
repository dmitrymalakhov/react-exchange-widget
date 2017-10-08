// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import React from 'react';
import ExchangeWidget from '../src';

const serviceApiConfig = {
  appID: '830bd997de434b7d9b8f11a239ab8eca',
};

const Root = () => (
  <ExchangeWidget serviceApiConfig={serviceApiConfig} />
);

Root.displayName = 'Root';

export default Root;
