import { render } from '@testing-library/react';

import { Nl2Br } from './nl2br';

describe('Nl2Br', () => {
  it('should render', () => {
    const { container } = render(<Nl2Br>foo</Nl2Br>);

    expect(container).toMatchSnapshot();
  });

  it('should render with breakLimit', () => {
    const { container } = render(
      <Nl2Br breakLimit={2}>{`
      foo
      
      
      
      
      
      bar
    `}</Nl2Br>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with multiple new lines', () => {
    const { container } = render(
      <Nl2Br>
        {`foo bar
        
        
        
        foo bar
        
        foo bar
        
        `}
      </Nl2Br>,
    );

    expect(container).toMatchSnapshot();
  });
});
