import React from "react";
import { render } from "react-dom";

import Contador from "./src/components/Contador.jsx";
import Main from "./src/containers/Main.jsx";

render(<Contador contador={0} />, document.getElementById("app"));

const products = [
  { title: "Um", price: 1 },
  { title: "Dois", price: 12 },
  { title: "Tres", price: 3 },
  { title: "quatro", price: 4 },
];

// render(<Main products={products}/>, document.getElementById('app'));
