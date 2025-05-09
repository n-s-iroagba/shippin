import React from 'react';

const Button = ({ primary, children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md transition-all duration-200 ${primary ? 'bg-primary-blue text-white hover:bg-dark-blue' : 'bg-lighter-blue/10 text-dark-blue hover:bg-lighter-blue/20'}`}
      {...props}
    >
      {children}
    </button>
  );
};

const App = () => {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
    </div>
  );
};

export default App;