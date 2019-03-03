/* eslint-disable no-sequences */
import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import roger from '../index';

describe('Given the Jolly Roger library', () => {
  beforeEach(() => {
    roger.flush();
  });
  describe('when we use the Roger\'s useState', () => {
    it('should define a globally accessible state', () => {
      const selector = jest.fn();
      const A = function () {
        const [ foo ] = roger.useState('foo', 'hello');

        return <p>{ foo }</p>;
      };
      const { container } = render(<A />);

      roger.select(selector);

      expect(container.textContent).toEqual('hello');
      expect(selector).toBeCalledWith({foo: 'hello'});
    });
    it('should throw an error if we miss to pass a slice name', () => {
      const A = function () {
        const [ foo ] = roger.useState();

        return <p>{ foo }</p>;
      };

      expect(() => {
        render(<A />);
      }).toThrow();
    });
    it('should set an initial state only if it is not set already', () => {
      const A = () => (roger.useState('foo', 'a'), null);
      const B = () => (roger.useState('foo', 'b'), null);

      render(<A />);
      render(<B />);

      expect(roger.select()).toStrictEqual({ foo: 'a' });
    });
    it('should allow managing same state slice from different components', () => {
      const A = () => {
        const [ foo, update ] = roger.useState('foo', 0);

        return <button onClick={ () => update(foo + 1) } data-testid='buttonA'>value: { foo }</button>;
      };
      const B = () => {
        const [ foo, update ] = roger.useState('foo');

        return <button onClick={ () => update(foo + 1) } data-testid='buttonB'>value: { foo }</button>;
      };

      const { getByTestId } = render(
        <div><A /><B /></div>
      );

      fireEvent.click(getByTestId('buttonA'));
      fireEvent.click(getByTestId('buttonB'));
      fireEvent.click(getByTestId('buttonB'));

      expect(roger.select()).toStrictEqual({ foo: 3 });
      expect(getByTestId('buttonA').textContent).toEqual('value: 3');
      expect(getByTestId('buttonB').textContent).toEqual('value: 3');
    });
    it('should clean up with the component is unmounted', () => {
      const A = () => (roger.useState('foo'), null);
      const B = () => (roger.useState('foo'), null);
      const Wrapper = () => {
        const [ visible, hide ] = roger.useState('visible', true);

        if (visible) {
          return (
            <div>
              <A />
              <B />
              <button data-testid='button' onClick={ () => hide(false) }>click me</button>
            </div>
          );
        }
        return <p>Nothing</p>;
      };

      expect(Object.keys(roger.inspect().updaters).length).toEqual(0);

      const { getByTestId, container } = render(<Wrapper />);

      expect(Object.keys(roger.inspect().updaters)).toStrictEqual(['visible', 'foo']);
      expect(roger.inspect().updaters['foo'].length).toEqual(2);

      fireEvent.click(getByTestId('button'));

      expect(container.textContent).toEqual('Nothing');
      expect(roger.inspect().updaters['foo'].length).toEqual(0);
      expect(roger.inspect().updaters['visible'].length).toEqual(1);
    });
  });
});
