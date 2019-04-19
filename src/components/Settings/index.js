/* eslint-disable max-len */
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { CHECK, CHEVRON_RIGHT, ARROW_RIGHT_CIRCLE } from '../Icons';
import Loading from '../Loading';
import roger from 'jolly-roger';
import Header from '../Header';
import useDimSeenEvents from './useDimSeenEvents';
import PullingInterval from './PullingInterval';

export default function Repos() {
  const textInput = useRef(null);
  const { fetchOrganizations, fetchAllRepos, toggleRepo } = roger.useContext();
  const [ repos, setRepos ] = roger.useState('repos');
  const [ profile ] = roger.useState('profile');
  const [ searchQuery, setSearchQuery ] = useState([]);
  const [ filter, setFilter ] = useState('');
  const [ error, setError ] = useState(null);
  const [ isFetchingRepos, setFetchingRepos ] = useState(false);
  const [ noRepos, setNoRepos ] = useState(false);
  const { component: dimSeenEventsComponent } = useDimSeenEvents();

  useEffect(() => {
    fetchOrganizations().then(
      orgs => {
        setSearchQuery([
          { label: 'My repositories', param: `user:${ profile.login }`, selected: true },
          ...orgs.map(org => ({
            label: `Repositories in "${ org.name }" organization`,
            param: `org:${ org.login }`,
            selected: false
          }))
        ]);
        textInput.current.focus();
      },
      error => {
        console.log(error);
        setError(new Error('IGit can not get your organizations. Wait a bit and refresh the page.'));
      }
    );
  }, []);

  const handleKeyUp = e => {
    if (e.key === 'Enter' && e.target.value !== '') {
      setFetchingRepos(true);
      setNoRepos(false);
      fetchAllRepos(`${ filter } in:name ` + searchQuery
        .filter(({ selected }) => selected)
        .map(({ param }) => param)
        .join(' ')
      ).then(
        allRepos => {
          if (allRepos.length === 0) {
            setNoRepos(true);
          }
          setRepos(allRepos);
          setFetchingRepos(false);
          textInput.current.focus();
        },
        error => {
          console.log(error);
          setError(new Error('IGit can not fetch repositories.'));
          setFetchingRepos(false);
        }
      );
    }
  };

  if (error) {
    return <div className='error tac centered-content mt2'>{ error.message }</div>;
  }

  if (searchQuery.length === 0) {
    return (
      <div className='centered-content tac mt2'>
        <Loading showLogo={ false } message='Loading organizations. Please wait.'/>
      </div>
    );
  }

  const selectedRepos = repos
    .filter(({ selected }) => selected)
    .map(repo => (
        <a className='list-link selected' key={ repo.repoId } onClick={ () => toggleRepo(repo) }>
          <CHECK size={ 18 }/> { repo.nameWithOwner }
        </a>
      ));

  return (
    <div className='layout'>
      <aside>
        <Header profile={ profile } />
        <Link to='/' className='list-link'>
          <CHEVRON_RIGHT size={ 18 }/>
          Dashboard
        </Link>
        <Link to='/settings' className='list-link'>
          <ARROW_RIGHT_CIRCLE size={ 18 }/>
          Settings
        </Link>
      </aside>
      <div className='settings'>
        <div className='pr-card mt1'>
          <h2 className='tac'>
            <img className='avatar iblock mb1' src={ profile.avatar } />
            <br />
            Hey, { profile.name }
          </h2>
        </div>
        <div className='mt2 pr-card-light'>
          { selectedRepos.length > 0 &&
            <div className='mb2'>
              <h3 className='mb1'>Selected repositories</h3>
              { selectedRepos.length > 0 && <p>You have { selectedRepos.length } selected { selectedRepos.length > 1 ? 'repositories' : 'repository'}. Go to the <Link to='/'>dashboard</Link> to manage your pull requests.</p>}
              { selectedRepos }
            </div>
          }
          <h3 className='mb1'>Search for a repository</h3>
          <div className='search-criteria mb1'>
            {
              searchQuery.map(criteria => {
                return (
                  <label key={ criteria.param }>
                    <input type='checkbox' checked={ criteria.selected } onChange={
                      () => setSearchQuery(searchQuery.map(c => {
                        if (c === criteria) {
                          c.selected = !c.selected;
                        }
                        return c;
                      }))
                    }/>
                    <span>{ criteria.label }</span>
                  </label>
                );
              })
            }
          </div>
          <div key='filter'>
            <input
              ref={ textInput }
              type='text'
              placeholder='repository name'
              className='mb1'
              onChange={ (e) => setFilter(e.target.value) }
              onKeyUp={ handleKeyUp }
              disabled={ isFetchingRepos }/>
          </div>
          { isFetchingRepos && (
            <div className='centered-content tac mb1'>
              <Loading showLogo={ false } message='Loading repositories. Please wait.'/>
            </div>
          ) }
          { noRepos && <p>No results.</p> }
          {
            !isFetchingRepos &&
              repos
                .filter(({ nameWithOwner, selected }) => {
                  return (filter === '' || nameWithOwner.match(new RegExp(filter, 'gi'))) && !selected;
                })
                .map(repo => {
                  const className = `list-link ${ repo.selected ? ' selected' : 'list-link'}`;

                  return (
                    <a className={ className } key={ repo.repoId } onClick={ () => toggleRepo(repo) }>
                      <CHECK size={ 18 }/> { repo.nameWithOwner }
                    </a>
                  );
                })
          }
        </div>
        <div className='mt2 pr-card-light'>
          <h3 className='mb1'>Other settings</h3>
          { dimSeenEventsComponent }
          <hr />
          <PullingInterval />
        </div>
      </div>
    </div>
  );
}
