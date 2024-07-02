import React from "react";

class Contador extends React.Component {
  constructor(props) {
    super(props);
    this.state = { contador: this.props.contador };
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick(e) {
    e.preventDefault();
    this.setState({
      contador: this.state.contador + 1,
    });
  }
  render() {
    return (
      <div>
        <button onClick={this.onButtonClick}>Somar um!</button>
        <p>Hola, vanesa {this.state.contador}!!</p>
      </div>
    );
  }
}

export default Contador;
