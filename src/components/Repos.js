/* eslint-disable max-len */
import React, { Fragment } from 'react';

import FetchRepos from './FetchRepos';
import { CHECK } from './Icons';
import Loading from './Loading';

export default function Repos() {
  return (
    <div className='repos'>
      <FetchRepos>
        {
          (repos, error) => {
            if (error) {
              return (
                <div className='error tac centered-content'>
                  GitHorn can't fetch your repositories. Try again by refreshing the page.
                </div>
              );
            }
            if (repos.length === 0) {
              return (
                <div className='centered-content tac'>
                  <Loading showLogo={ false } message='Loading your repositories. Please wait.'/>
                </div>
              );
            }
            console.log(repos);
            return (
              <Fragment>
                <h1 className='tac'>Your repositories</h1>
                <p className='tac'>Select the repositories that you want to manage.</p>
                <ul className='centered-content mt3'>
                  {
                    repos.map(repo => {
                      console.log(repo);
                      return (
                        <li key={ repo.id } className='repo'>
                          <p>
                            <a className='subscribe' onClick={ () => {} }>
                              <CHECK /> { repo.full_name }
                            </a>
                          </p>
                          <small><a href={ repo.html_url } target='_blank'>view</a></small>
                        </li>
                      );
                    })
                  }
                </ul>
              </Fragment>
            );
          }
        }
      </FetchRepos>
    </div>
  );
}
