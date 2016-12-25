import hoistStatics from 'hoist-non-react-statics';

const DEFAULT_POLLING_INTERVAL = 60 * 1000;

export function poll(Component) {
  class PollingComponent extends Component {
    // FIXME(vkramskikh): there is no automatic inheritance of static props for some reason
    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount();
      this.startPolling();
    }

    componentWillUnmount() {
      this.stopPolling();
      if (super.componentWillUnmount) super.componentWillUnmount();
    }

    startPolling() {
      this.activePollingTimeout = setTimeout(async () => {
        try {
          await this.fetchData();
        } finally {
          this.startPolling();
        }
      }, this.pollingInterval || DEFAULT_POLLING_INTERVAL);
    }

    stopPolling() {
      if (this.activePollingTimeout) clearTimeout(this.activePollingTimeout);
    }
  }
  return hoistStatics(PollingComponent, Component);
}
