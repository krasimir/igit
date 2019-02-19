/* eslint-disable react/prop-types */

import React from 'react';

import api from './api';

const value = {
  api
};

const GitHornContext = React.createContext();

export default {
  context: GitHornContext,
  Provider: ({ children }) => {
    return <GitHornContext.Provider value={ value }>{ children }</GitHornContext.Provider>;
  },
  Consumer: GitHornContext.Consumer
};
