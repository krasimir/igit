/* eslint-disable max-len, react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { CHEVRON_RIGHT, CHEVRON_DOWN } from './Icons';
import Diff from './utils/Diff';
import { Link } from 'react-router-dom';

const INDENT_STEP = 4;

function Directory({ dir, indent, url }) {
  const isFile = dir.items === null;

  const inFileView = url.match(/\/files$/) !== null;

  return (
    <div style={ { paddingLeft: `${ indent }px` } } className={ isFile ? 'is-file' : 'is-dir' }>
      { !isFile ?
          dir.path :
          inFileView ?
              <a href={ `#${ dir.fullPath }` }>{ dir.path }</a> :
              <Link to={ `${url}/files#${ dir.fullPath }` }>{ dir.path }</Link>
      }
      { isFile ?
        <Diff data={ { additions: dir.additions, deletions: dir.deletions } } /> : '' }
      { !isFile && dir.items.map(item => <Directory url={ url } dir={ item } indent={ indent + INDENT_STEP } key={ item.path }/>)}
    </div>
  );
}

export default function FilesPreview({ pr, url }) {
  const [ expanded, expand ] = useState(false);

  return (
    <div className='mt1 fz8'>
      <button className='as-link' onClick={ () => expand(!expanded) }>
        { expanded ? <CHEVRON_DOWN size={ 14 } /> : <CHEVRON_RIGHT size={ 14 } /> }
        Files changed ({ pr.files.total })
      </button>
      {
        expanded && (
          <div className='pl1 bl1 ml1 files-preview'>
            {
              pr.files.tree.items.map(item => <Directory url={ url } dir={ item } indent={ INDENT_STEP } key={ item.path } />)
            }
          </div>
        )
      }
    </div>
  );
}

FilesPreview.propTypes = {
  pr: PropTypes.object.isRequired
};
