import React from 'react';
import PropTypes from 'prop-types';

import Date from './utils/Date';
import Diff from './utils/Diff';
import { CHECK_CIRCLE, STORM, GIT_COMMIT, MESSAGE, EDIT, GIT_MERGE } from './Icons';

const trim = function (str, maxLen = 54) {
  if (str.length > maxLen) {
    return str.substr(0, maxLen) + '...';
  }
  return str;
};

export default function Timeline({ pr }) {
  const events = pr.events.map((event, key) => {
    switch (event.type) {

      case 'Commit':
        return (
          <div className='media small' key={ key }>
            <img src={ event.author.avatar } className='avatar'/>
            <div>
              <Date event={ event }/>&nbsp;
              <span className='iblock'>
                <GIT_COMMIT size={ 18 }/>
                { trim(event.message) }
              </span>&nbsp;
              <small className='opa5'>
                <a href={ event.url } target='_blank'>{ event.oid.substr(0, 7) }</a>
              </small>
              <Diff data={ event } className='opa5'/>
            </div>
          </div>
        );

      case 'PullRequestReview':
        let StateIcon = MESSAGE;

        switch (event.state) { // APPROVED, CHANGES_REQUESTED, COMMENTED, DISMISSED, PENDING
          case 'APPROVED':
            StateIcon = CHECK_CIRCLE;
          break;
          case 'CHANGES_REQUESTED':
            StateIcon = STORM;
          break;
        }
        return (
          <div className='media small' key={ key }>
            <img src={ event.author.avatar } className='avatar'/>
            <div>
              <Date event={ event } />&nbsp;
              <StateIcon size={ 18 }/>
              { event.state.toLowerCase().replace('_', ' ') }
            </div>
          </div>
        );

      case 'PullRequestReviewComment':
      case 'IssueComment':
        return (
          <div className='media small' key={ key }>
            <img src={ event.author.avatar } className='avatar'/>
            <div>
              <Date event={ event } />&nbsp;
              <MESSAGE size={ 18 }/>
            </div>
          </div>
        );

      case 'MergedEvent':
        return (
          <div className='media small' key={ key }>
            <img src={ event.author.avatar } className='avatar'/>
            <div>
              <Date event={ event } />&nbsp;
              <GIT_MERGE size={ 18 }/>
              <small>merged to</small> <strong>{ event.ref }</strong>
            </div>
          </div>
        );

      case 'PullRequestReviewThread':
        return event.comments.map((comment, i) => {
          let str = comment.path;

          if (str.length > 60) {
            str = '...' + str.substr(str.length - 60, str.length);
          }
          str += comment.position ? ':' + comment.position : '';

          return (
            <div className={ `media small ${ i > 0 ? 'ml1' : ''}` } key={ key + i }>
              <img src={ comment.author.avatar } className='avatar'/>
              <div>
                <Date event={ comment } />&nbsp;
                <MESSAGE size={ 18 }/>
                <small>{ str }</small>
              </div>
            </div>
          );
        });

      case 'RenamedTitleEvent':
        return (
          <div className='media small' key={ key }>
            <img src={ event.author.avatar } className='avatar'/>
            <div>
              <Date event={ event } />&nbsp;
              <EDIT size={ 18 }/>
              { trim(`renamed to ${ event.currentTitle }`) }
            </div>
          </div>
        );

      case 'CrossReferencedEvent':
      case 'ReferencedEvent':
        return (
          <div className='media small' key={ key }>
            <img src={ event.author.avatar } className='avatar'/>
            <div>
              <Date event={ event } />&nbsp;
              <MESSAGE size={ 18 }/>
              <small>mentioned at</small>&nbsp;
              <a href={ event.target.url } target='_blank'>{ trim(`${ event.target.title }`, 40) }</a>
            </div>
          </div>
        );

    }
    return null;
  });

  return (
    <div className='timeline'>
      { events }
    </div>
  );
};

Timeline.propTypes = {
  pr: PropTypes.object.isRequired
};
