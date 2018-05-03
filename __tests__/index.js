const { h, render, Component } = require("preact");
const { createContext } = require("../dist/");

describe("context", () => {
  beforeEach(() => (document.body.innerHTML = ""));

  it("should render children in Provider and Consumer", () => {
    const { Provider, Consumer } = createContext();

    render(h(Provider, undefined, "hi there from Provider"), document.body);
    expect(document.body.innerHTML).toBe("hi there from Provider");

    render(
      h(Consumer, undefined, () => "hi there from Consumer"),
      document.body,
      document.body.lastChild
    );
    expect(document.body.innerHTML).toBe("hi there from Consumer");
  });

  it("Consumer should get value of Provider", () => {
    const { Provider, Consumer } = createContext();

    const App = () =>
      h(
        Provider,
        { value: "pass this pls" },
        h(Consumer, undefined, value => value)
      );

    render(h(App), document.body);

    expect(document.body.innerHTML).toBe("pass this pls");
  });

  it("Consumer should update with new Provider value", async () => {
    const { Provider, Consumer } = createContext();
    const promise = new Promise(resolve => (this.resolve = resolve));
    const self = this;

    const ValueDisplayer = () => h(Consumer, undefined, value => value);

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          value: "now pass this"
        };
      }
      componentDidMount() {
        if (this.state.value === "wow it changed") {
          self.resolve();
        }
      }
      render(props, { value }) {
        if (value !== "wow it changed") {
          this.setState({ value: "wow it changed" });
        }
        return h(Provider, { value }, h(ValueDisplayer));
      }
    }

    render(h(App), document.body);
    await promise;

    expect(document.body.innerHTML).toBe("wow it changed");
  });

  it("Consumer should remove listener", () => {
    const { Consumer, Provider, context } = createContext();

    const componentWillUnmount = jest
      .spyOn(Consumer.prototype, "componentWillUnmount")
      .mockImplementationOnce(function() {
        Consumer.prototype.componentWillUnmount.call(this);
        expect(context.setStates.length).toBe(1);
      });

    render(
      h(
        "div",
        undefined,
        h(Consumer, undefined, Object),
        h(Consumer, undefined, Object)
      ),
      document.body
    );
    render("", document.body, document.body.lastChild);

    expect(componentWillUnmount).toBeCalled();
  });
});
