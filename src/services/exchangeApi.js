// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import axios, { CancelToken } from 'axios';
import { noop } from '../utils/misc';

export type CRUD = {
  read: ?Object => Promise<() => any, () => any>,
};

export default (appID: string): Function =>
  (endpoint: string): CRUD => {
    const connection = axios.create({
      baseURL: 'https://openexchangerates.org/api',
      timeout: 2000,
    });

    const internalParams = {
      app_id: appID,
    };

    let cancel = noop;

    return {
      read: (externalParams: ?Object) => connection.get(`/${endpoint}.json`, {
        params: {
          ...internalParams,
          ...externalParams,
        },
        cancelToken: new CancelToken(cancelFn => {
          cancel = cancelFn;
        }),
      }),

      cancel: () => cancel(),
    };
  };
