import React, { useState, useEffect } from 'react';

import withAPI from './withAPI';

const store = {
  profile: null
};

const ProfileInjector = withAPI(function ({ api, children }) {
  const [ profile, setProfile ] = useState(store.profile);

  useEffect(function () {
    if (profile === null) {
      api.getProfile().then(profile => setProfile(profile));
    }
  });

  return children(profile);
});

export default function withProfile(Component) {
  return function Profile() {
    return (
      <ProfileInjector>
        {
          profile => <Component profile={ profile } />
        }
      </ProfileInjector>
    );
  };
};
