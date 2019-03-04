/* eslint-disable no-sequences */
import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import roger from '../index';

describe('Given the Jolly Roger library', () => {
  beforeEach(() => {
    roger.flush();
  });
  describe('when we use the Roger\'s useReducer', () => {
    it(`should
      - create a dedicated slice in the state
      - define a context method
      - allow context method with the same name`, () => {
      const spy = jest.fn();

      roger.useReducer('foo', {
        add(state, num) {
          return state + num ;
        }
      });
      roger.context({
        add(...args) {
          spy(...args);
        }
      });

      const A = function () {
        const [ foo ] = roger.useState('foo', 0);
        const { add } = roger.useContext();

        return (
          <button data-testid='button' onClick={ () => add(10) }>
            { foo }
          </button>
        );
      };

      const { container, getByTestId } = render(<A />);

      expect(container.textContent).toEqual('0');

      fireEvent.click(getByTestId('button'));
      fireEvent.click(getByTestId('button'));

      expect(container.textContent).toEqual('20');
      expect(spy).toBeCalledWith(10, expect.any(Object));
      expect(spy).toBeCalledTimes(2);
    });
  });
});
