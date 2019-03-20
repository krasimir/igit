/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CHECK } from './Icons';
import Loading from './Loading';
import roger from '../jolly-roger';

export default function Repos() {
  const { fetchOrganizations, fetchAllRepos, toggleRepo } = roger.useContext();
  const [ repos, setRepos ] = roger.useState('repos');
  const [ profile ] = roger.useState('profile');
  const [ searchQuery, setSearchQuery ] = useState([]);
  const [ filter, setFilter ] = useState('');
  const [ error, setError ] = useState(null);
  const [ isFetchingRepos, setFetchingRepos ] = useState(false);
  const [ noRepos, setNoRepos ] = useState(false);

  useEffect(() => {
    fetchOrganizations().then(
      orgs => setSearchQuery([
        { label: 'My repositories', param: `user:${ profile.login }`, selected: true },
        ...orgs.map(org => ({
          label: `Repositories in "${ org.name }" organization`,
          param: `org:${ org.login }`,
          selected: false
        }))
      ]),
      error => {
        console.log(error);
        setError(new Error('GitHorn can not get your organizations. Wait a bit and refresh the page.'));
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
        },
        error => {
          console.log(error);
          setError(new Error('GitHorn can not fetch repositories.'));
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
  return (
    <div className='settings'>
      <h2 className='tac mb2 mt2'>Hey, { profile.name }</h2>
      <p className='tac'>Use the form below to select the repositories that you are interested in.<br />Once you are done go back to the <Link to='/'>home page</Link>.</p>
      <div className='centered-content mt2'>
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
        <div className='mb2' key='filter'>
          <input
            type='text'
            placeholder='repository name'
            className='mb1'
            onChange={ (e) => setFilter(e.target.value) }
            onKeyUp={ handleKeyUp }
            disabled={ isFetchingRepos }/>
        </div>
        { isFetchingRepos && (
          <div className='centered-content tac'>
            <Loading showLogo={ false } message='Loading repositories. Please wait.'/>
          </div>
        ) }
        { noRepos && <p>No results.</p> }
        {
          !isFetchingRepos &&
            repos
              .filter(({ nameWithOwner, selected }) => {
                return filter === '' || nameWithOwner.match(new RegExp(filter, 'gi')) || selected;
              })
              .map(repo => {
                const className = `list-link ${ repo.selected ? ' selected' : 'list-link'}`;

                return (
                  <a className={ className } key={ repo.repoId } onClick={ () => toggleRepo(repo) }>
                    <CHECK /> { repo.nameWithOwner }
                  </a>
                );
              })
        }
      </div>
    </div>
  );
}
