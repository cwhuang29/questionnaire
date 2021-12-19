import React, { useEffect, useRef, useState } from 'react';

import { SLIDE_SHOW_DELAY } from 'shared/constant/styles';

const Slideshow = () => {
  const [index, setIndex] = useState(1);
  const [showAnimation, setShowAnimation] = useState(true);
  const timeoutRef = useRef(null);

  const images = [
    { src: '/assets/slideShow/yellow.png', key: 0 },
    { src: '/assets/slideShow/blue.png', key: 1 },
    { src: '/assets/slideShow/green.png', key: 2 },
    { src: '/assets/slideShow/yellow.png', key: 3 },
    { src: '/assets/slideShow/blue.png', key: 4 },
  ]; // Duplicate first slide in the end and last slide in the beginning

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const transitionEnd = () => {
    if (index === images.length - 1) {
      setIndex(1); // The timeout will be reset (and not execute) due to index changes
      setShowAnimation(false); // There is a time span before reseting to true. If user clicks dot before that time, slides will move without animation
    }
    // if (index === 0 && isMovingBackward) {
    //   setIndex(images.length - 2);
    //   setShowAnimation(false);
    // }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex === images.length - 1 ? 2 : prevIndex + 1));
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
        maxWidth: '1800px',
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
        {images.map((image, slideIdx) => (
          <div
            key={image.key}
            className={`slide${index === slideIdx ? ' active' : ''}`}
            style={{
              background: `url(${image.src})`,
              display: 'inline-block',
              height: '600px',
              width: '100%',
              borderRadius: '10px',
            }}
          />
        ))}
      </div>

      <div className='slideShowDots' style={{ textAlign: 'center', marginTop: '-42px', paddingBottom: '10px' }}>
        {images.map((image, dotIdx) =>
          dotIdx === 0 || dotIdx === images.length - 1 ? null : (
            <button
              key={image.key}
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
                  index === dotIdx || (dotIdx === 1 && index === images.length - 1) || (dotIdx === images.length - 2 && index === 0) ? '#565656' : '#eeeeee',
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Slideshow;
