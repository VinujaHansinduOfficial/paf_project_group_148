import axios from 'axios';
import { useAuth } from './AuthContext';

const SomeComponent = () => {
  const { token } = useAuth();

  const fetchData = () => {
    axios.get('/some-protected-route', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return <button onClick={fetchData}>Fetch</button>;
};

export default SomeComponent;
