import { useContext } from 'react';
import GlobalMessageContext from 'components/MessageBar';

const useGlobalMessageContext = () => useContext(GlobalMessageContext);

export default useGlobalMessageContext;
