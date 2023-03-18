import React, { Component, lazy, Suspense } from 'react';
import { Spring } from 'react-spring/renderprops';
import { Transition, animated } from 'react-spring/renderprops';
import ErrorBoundary from '../errorBoundary';
import { DynamicModulePropsInterface, DynamicModuleStateInterface } from '.';

export default class DynamicModule extends Component<DynamicModulePropsInterface, DynamicModuleStateInterface> {
  public state = {
    Component: null,
    initializing: false,
  };

  private onAnimationFrameCallback = null;

  public componentDidMount() {
    this.setState({
      Component: lazy(this.props.component),
      initializing: true,
    });
  }

  public componentWillUnmount() {
    window.cancelAnimationFrame(this.onAnimationFrameCallback);
  }

  private onInitialized = () => {
    this.onAnimationFrameCallback = window.requestAnimationFrame(() => {
      this.setState({
        initializing: false,
      });
    });
  };

  public render() {
    const { children, fallback, placeholder, style = {}, ...rest } = this.props;
    const { Component, initializing } = this.state;

    const defaultStyles = {
      width: '100%',
    };

    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          ...style,
        }}
      >
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={placeholder}>
            <Spring
              from={{
                ...defaultStyles,
                opacity: !initializing,
              }}
              to={{
                ...defaultStyles,
                opacity: initializing,
              }}
            >
              {props => <div style={props}>{React.cloneElement(placeholder)}</div>}
            </Spring>
            <Spring
              from={{
                opacity: initializing,
                transform: `translate3d(0, -50px, 0)`,
              }}
              to={{
                opacity: !initializing,
                transform: `translate3d(0px, 0, 0)`,
              }}
            >
              {props =>
                Component && (
                  <Component
                    {...rest}
                    style={{
                      position: 'absolute',
                      height: '100%',
                      ...props,
                    }}
                    onInitialized={this.onInitialized}
                  />
                )
              }
            </Spring>
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }
}
