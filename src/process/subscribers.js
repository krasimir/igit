import { subscribe } from '../react-process';
import { GET_PROFILE } from './constants';

subscribe(GET_PROFILE, () => {
  console.log('gogo');
});
