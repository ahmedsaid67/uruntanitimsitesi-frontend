import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setSize([window.innerWidth, window.innerHeight]);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return size;
}

export default useWindowSize;