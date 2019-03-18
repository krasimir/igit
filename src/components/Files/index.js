import React from 'react';
import PropTypes from 'prop-types';
import diffParser from 'gitdiff-parser';

import { getHunkFiles, getDiffItemType } from '../utils/ReviewDiff';

export default function Files({ pr, repo, className }) {
  const parsedDiff = diffParser.parse(pr.diff);

  return parsedDiff.map((diffItem, key) => {
    let filenames = getHunkFiles(diffItem.oldPath, diffItem.newPath);

    return (
      <div className={ `hunk ${ className }` } key={ key }>
        <div className='header'>
          <span className='tag'>{ getDiffItemType(diffItem.type) }</span>&nbsp;
          <span className='filenames'>{ filenames }</span>
        </div>
      </div>
    );
  });
};

Files.propTypes = {
  pr: PropTypes.object.isRequired,
  repo: PropTypes.object.isRequired,
  className: PropTypes.string
};
