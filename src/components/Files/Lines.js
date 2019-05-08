import React from 'react';

export function createLine(path, lineNumber, content, type, diffLine) {
  const row = {
    type: type || 'full-content',
    path,
    line: lineNumber,
    diffLine: diffLine ? diffLine : 0,
    content
  };

  return row;
};

export function createTable() {
  return { rows: [], __table: true };
}

export function isCodeItem(item) {
  return !!item.__table;
}

export default function Lines({ items, openComment }) {
  return items.map((item, i) => {
    if (isCodeItem(item)) {
      return (
        <div className='lines' key={ i }>
          <table className='lines-wrapper'>
            <tbody>
              {
                item.rows.map((row, j) => (
                  <tr className={
                    `code-line ${ row.diffLine === 0 ? 'code-line-start' : ''} ${ row.type }`
                  } key={ j }>
                  <td>
                    {
                      openComment ?
                        <button className='as-link'
                          onClick={ () =>
                            openComment({ path: row.path, line: row.line, diffLine: row.diffLine })
                          }>
                          <small className='opa5'>{ row.line }</small>
                        </button> :
                        <small className='opa5'>{ row.line }</small>
                    }
                  </td>
                  <td><pre>{ row.content }</pre></td>
                </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      );
    }
    return item;
  });
}
