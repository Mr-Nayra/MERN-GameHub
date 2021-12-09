import React from 'react';

import Snake from './components/Snake';

export default class App extends React.Component {
  render () {
    return (
      <div className = "app">
        <Snake />
      </div>
    )
  }
};
