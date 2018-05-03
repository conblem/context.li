import { Component } from "preact";

const Provider = context =>
  class Provider extends Component {
    constructor(props) {
      super(props);
      context.value = props.value;
    }
    shouldComponentUpdate(newProps) {
      // Trigger Consumer listeners if value changed
      if (this.props.value !== newProps.value) {
        context.value = newProps.value;
        context.setStates.forEach(setState => setState());
      }
      /* Only update if children changed because we don't
       * care about updates to the value as Consumers
       * will update on their own after their setState call
       */
      return this.props.children !== newProps.children;
    }
    render() {
      return this.props.children[0];
    }
  };

const Consumer = context =>
  class Consumer extends Component {
    constructor(props) {
      super(props);
      // Add setState with correct this to the listeners
      this.setState = this.setState.bind(this);
      context.setStates.push(this.setState);
    }
    componentWillUnmount() {
      // Delete listener when component unmounts
      const index = context.setStates.indexOf(this.setState);
      context.setStates.splice(index, 1);
    }
    render() {
      return this.props.children[0](context.value);
    }
  };

export const createContext = () => {
  const context = {
    setStates: [],
    value: undefined
  };

  return {
    Provider: Provider(context),
    Consumer: Consumer(context),
    context: context
  };
};
