import React, { Component, Fragment } from 'react';
import AccountService from '../../services/AccountService';
import AuthService from '../../services/AuthService';
import UrlUtil from '../../util/UrlUtil';

export default class OauthFlow extends Component {
  async componentDidMount() {
    if (process.env.AUTH_API === undefined) {
      const response = await AccountService.getOauthEndpoint();
      AccountService.setAuthApi(response.url);
    } else {
      AccountService.setAuthApi(process.env.AUTH_API);
    }
    const code = UrlUtil.getQueryVariable('code');

    if (code) {
      // they are in the process of logging in, need to exchange auth code for access token
      const response = await AccountService.getToken(code);
      AuthService.logIn(response.access_token, response.refresh_token);
      window.location.replace(`${location.origin}${location.pathname}`);
      return;
    }
    if (AuthService.isLoggedIn()) {
      return;
    }

    const scope = '';
    const state = '';
    const authApi = AccountService.getAuthApi();
    window.location.replace(
      `${authApi}/?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_url=${location.origin}${location.pathname}&scope=${scope}&state=${state}`
    );
  }

  render() {
    return <Fragment />;
  }
}
