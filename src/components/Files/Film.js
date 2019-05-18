import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { diffLines } from 'diff';

function Lines({ lines }) {
  return (
    <div className='lines'>
      <table className='lines-wrapper'>
        <tbody>
          {
            lines.map((line, j) => (
              <tr className='code-line normal' key={ j }>
              <td>
                <small className='opa5'>{ j + 1 }</small>
              </td>
              <td><pre>{ line }</pre></td>
            </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
Lines.propTypes = {
  lines: PropTypes.array.isRequired
};

export default function Film({ history }) {
  const items = history.map(({ content }) => content.split('\n'));
  const [ currentItemIndex, selectItem ] = useState(items.length - 1);

  return (
    <React.Fragment>
      <div>
        {
          history.map(({ message, date }, i) => (
            <div key={ i }>
              { i === currentItemIndex && '> '}
              <button
                className='as-link tal'
                onClick={ () => {
                  if (i !== currentItemIndex) {
                    const diff = diffLines(
                      history[currentItemIndex].content,
                      history[i].content
                    );

                    console.log(diff);
                    // selectItem(i);
                  }
                } }>
                { message }<br /><small>{ date }</small>
              </button>
            </div>
          ))
        }
      </div>
      <Lines lines={ items[currentItemIndex] }/>
    </React.Fragment>
  );
}

Film.propTypes = {
  history: PropTypes.array.isRequired
};
