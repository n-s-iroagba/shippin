
import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../hooks/useAuth';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <div data-testid="test-wrapper">
        {children}
      </div>
    </AuthProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: TestWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
