import React, { useEffect, useRef, useState } from 'react';

import { SLIDE_SHOW_DELAY } from 'shared/constant/styles';

const Slideshow = () => {
  const [index, setIndex] = useState(1);
  const [showAnimation, setShowAnimation] = useState(true);
  const timeoutRef = useRef(null);

  const colors = ['#FFBB28', '#0088FE', '#00C49F', '#FFBB28', '#0088FE']; // Duplicate first slide in the end and last slide in the beginning

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const transitionEnd = () => {
    if (index === colors.length - 1) {
      setIndex(1); // The timeout will be reset (and not execute) due to index changes
      setShowAnimation(false);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex === colors.length - 1 ? 2 : prevIndex + 1));
      setShowAnimation(true);
    }, SLIDE_SHOW_DELAY);
    return () => resetTimeout();
  }, [index]);

  return (
    <div
      className='slideShow'
      style={{
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
        // maxWidth: '800px',
      }}
    >
      <div
        className='slideShowSlider'
        onTransitionEnd={transitionEnd}
        style={{
          transform: `translate3d(${-index * 100}%, 0px, 0px)`,
          transition: showAnimation ? 'ease 1000ms' : 'none',
          whiteSpace: 'nowrap',
          zIndex: -100,
          position: 'relative',
        }}
      >
        {colors.map((backgroundColor, slideIdx) => (
          <div
            className={`slide${index === slideIdx ? ' active' : ''}`}
            style={{ backgroundColor, display: 'inline-block', height: '600px', width: '100%', borderRadius: '10px' }}
          />
        ))}
      </div>

      <div className='slideShowDots' style={{ textAlign: 'center', marginTop: '-42px', paddingBottom: '10px' }}>
        {colors.map((_, dotIdx) =>
          dotIdx === 0 || dotIdx === colors.length - 1 ? null : (
            <button
              className={`slideShowDot${index === dotIdx ? ' active' : ''}`}
              onClick={() => setIndex(dotIdx)}
              type='button'
              aria-label='label'
              style={{
                display: 'inline-block',
                height: '12px',
                width: '12px',
                borderRadius: '20px',
                border: 0,
                cursor: 'pointer',
                margin: '15px 7px 0px',
                backgroundColor:
                  index === dotIdx || (dotIdx === 1 && index === colors.length - 1) ? '#565656' : '#eeeeee',
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Slideshow;
