import React from 'react';

const DefaultErrorComponent = ({ clearError }: { clearError: () => void }) => (
  <div style={{ padding: '20px 10px' }}>
    <h5 style={{ margin: '0 0 6px 0', color: 'red' }}>Oops! An error has occured!</h5>
    <button
      type='button'
      onClick={clearError}
      style={{
        border: 'none',
        backgroundColor: 'transparent',
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      Reload Component
    </button>
  </div>
);

export const withErrorBoundary = <P extends object>(Component: React.ComponentType<P>) => {
  return class HOC extends React.Component<{}, { caughtError: Boolean }> {
    constructor(props) {
      super(props);
      this.state = {
        caughtError: false,
      };
    }
    static getDerivedStateFromError(err) {
      return { caughtError: true };
    }
    componentDidCatch(err, info) {
      console.error(err);
      console.info(info);
    }
    clearError = () => {
      this.setState({ caughtError: false });
    };
    render() {
      return this.state.caughtError ? (
        <DefaultErrorComponent clearError={this.clearError} />
      ) : (
        <Component {...(this.props as P)} />
      );
    }
  };
};
