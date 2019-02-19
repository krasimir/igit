import React from 'react';
import PropTypes from 'prop-types';

import Context from '../../context';

class APIInjector extends React.Component {
  render() {
    return this.props.children(this.context);
  }
}
APIInjector.contextType = Context.context;
APIInjector.propTypes = {
  children: PropTypes.func.isRequired
};

export default function withAPI(Component) {
  return function API(props) {
    return (
      <APIInjector>
        {
          context => <Component { ...props } api={ context.api }/>
        }
      </APIInjector>
    );
  };
};

