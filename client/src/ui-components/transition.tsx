import React from 'react';

type TransitionProps = {
  children: React.ReactNode;
  transition: 'fade' | 'fade-slide' | 'fade-bounce';
  delay?: number;
  duration?: number;
};

const transitionConfigs = {
  fade: {
    easing: 'ease-out',
    props: [
      {
        visibility: 'visible',
        opacity: 0,
      },
      {
        visibility: 'visible',
        opacity: 1,
      },
    ],
  },
  'fade-slide': {
    easing: 'ease-out',
    props: [
      {
        visibility: 'visible',
        opacity: 0,
        translate: '0 -20%',
      },
      {
        visibility: 'visible',
        translate: '0 0',
      },
    ],
  },
  'fade-bounce': {
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    props: [
      {
        visibility: 'visible',
        opacity: 0,
        translate: '-40% 0',
      },
      {
        visibility: 'visible',
        translate: '0 0',
        opacity: 1,
      },
    ],
  },
};

export function Transition(props: TransitionProps) {
  const { children, transition, duration = 300, delay = 0 } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const transitionConfig = transitionConfigs[transition];

    if (ref.current) {
      ref.current.animate(transitionConfig.props, {
        delay,
        duration,
        iterations: 1,
        fill: 'forwards',
        easing: transitionConfig.easing,
      });
    }
  }, [transition, delay, duration]);

  return (
    <div ref={ref} css={{ visibility: 'hidden' }}>
      {children}
    </div>
  );
}
