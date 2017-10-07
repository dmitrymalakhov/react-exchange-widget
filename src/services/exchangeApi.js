// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import axios from 'axios';

export type CRUD = {
  read: () => Promise<() => any, () => any>,
};

export default (appID: string): Function => (endpoint: string): CRUD => {
  const connection = axios.create({
    baseURL: 'https://openexchangerates.org/api',
    timeout: 2000,
  });

  return {
    read: () => connection.get(`/${endpoint}.json`, { app_id: appID }),
  };
};
