import { useEffect, useRef } from 'react';

// Usage: const prevCount = usePrevious(count);
// This would work for props, state, or any other calculated value
export default usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
