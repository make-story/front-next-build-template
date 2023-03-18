import React from 'react';
import { Spring } from 'react-spring/renderprops';
import './asyncComponent.css';
import { delay, randomNumberInRange } from '../../utils';
import { AsyncComponentPropsInterface } from '.';
import ActionButtons from '../actionButtons';

export default class AsyncComponent extends React.Component<AsyncComponentPropsInterface, any> {
  state = {
    show: false,
  };

  private timer = null;

  public componentDidMount() {
    // fetch some external data to populate the component
    // then call the onInitialized callback to tell
    // our dynamic module component to render this component
    // instead of the placeholder
    delay(randomNumberInRange(2000, 5000)).then(() => {
      this.props.onInitialized();
      this.timer = setInterval(this.toggle, 2000);
    });
  }

  public componentWillUnmount() {
    clearTimeout(this.timer);
  }

  private toggle = () => {
    this.setState({ show: !this.state.show });
  };

  public render() {
    return (
      <div className='tileContainer' style={this.props.style}>
        <ActionButtons />
        <h1>
          Component Loaded
          <Spring from={{ opacity: !this.state.show }} to={{ opacity: this.state.show }}>
            {props => <span style={props}> 🙌</span>}
          </Spring>
        </h1>
      </div>
    );
  }
}
