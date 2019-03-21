/* eslint-disable no-sequences */
import React, { useEffect } from 'react';
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
  describe('when using context method multiple times', () => {
    it('should update the state and re-render the React components', () => {
      roger.context({
        fetchData(something, { register }) {
          register({ key: 'a', value: 10 });
          register({ key: 'b', value: 20 });
        }
      });
      roger.useReducer('foo', {
        register(state, { key, value }) {
          state[key] = value;
          return state;
        }
      });

      const spy = jest.fn();
      const A = function () {
        const { fetchData } = roger.useContext();
        const [ foo ] = roger.useState('foo', { c: 30 });

        useEffect(() => {
          fetchData();
        }, []);

        spy(foo);
        return null;
      };

      render(<A />);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ a: 10, b: 20, c: 30 });
    });
  });
});
