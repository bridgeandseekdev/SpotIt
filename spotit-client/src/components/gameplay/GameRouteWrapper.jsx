import { useParams } from 'react-router-dom';

function RouteWrapper({ children }) {
  const params = useParams();
  return children(params);
}

export default RouteWrapper;
