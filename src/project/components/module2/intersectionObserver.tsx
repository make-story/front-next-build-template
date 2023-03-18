import * as React from 'react';

import {
  IntersectionEntry,
  LocationObserverOptions,
  LocationObserverPropsInterface,
  LocationObserverStateInterface,
} from '.';

export default class LocationObserver extends React.Component<
  LocationObserverPropsInterface,
  LocationObserverStateInterface
> {
  public state = {
    hasIntersected: false,
  };

  private targetContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

  private options: LocationObserverOptions = {
    root: this.props.root || null,
    rootMargin: this.props.margin || '0px',
    threshold: this.props.threshold || 0,
  };

  private observer: any;

  public componentDidMount() {
    this.observer = new IntersectionObserver(this.load, this.options);
    this.observer.observe(this.targetContainerRef.current);
  }

  public componentWillUnmount() {
    // unbind observer
    this.observer.unobserve(this.targetContainerRef.current);
  }

  private load = (entries: IntersectionEntry[]): void => {
    // first condition is for when we want the intersection observer
    // to only execute the callback at most once. This is useful when
    // loading in modules on demand.
    if (!this.props.continueObserving && !this.state.hasIntersected) {
      const entry = entries.find(entry => entry.target === this.targetContainerRef.current);

      if (entry && entry.isIntersecting) {
        this.setState({ hasIntersected: true });
        this.props.onIntersection && this.props.onIntersection(entries);
        // unbind observer when we only want to execute once
        this.observer.unobserve(this.targetContainerRef.current);
      }
      // this prop tells us to execute the callback everytime that
      // an intersection is observed. This is useful for infinite
      // scrolling as you want to fetch the next set each time the
      // intersection occurs.
    } else if (this.props.continueObserving && this.props.onIntersection) {
      this.props.onIntersection(entries);
    }
  };

  public render() {
    const { children = null, continueObserving } = this.props;
    return (
      <div className='intersectionObserver' ref={this.targetContainerRef} style={{ ...this.props.style }}>
        {/* render the children of this component only when the intersection happens */}
        {continueObserving ? children : this.state.hasIntersected && children}
      </div>
    );
  }
}
