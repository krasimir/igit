/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import PropTypes from 'prop-types';

import Context from '../../context';

export default class FetchRepos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repos: [],
      error: null
    };
  }
  async componentDidMount() {
    try {
      this.setState({ repos: await this.context.api.getRepos() });
    } catch (error) {
      this.setState({ error });
    }
  }
  render() {
    const { children } = this.props;

    return children(this.state.repos, this.state.error);
  }
}

FetchRepos.contextType = Context.context;

FetchRepos.propTypes = {
  children: PropTypes.func.isRequired
};
