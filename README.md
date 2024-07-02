# React Siclo de Vida

## A melhor maneira de WebPack

Quando começamos a trabalhar em um projeto com estilo
Antes de incluir o REACT, não é a melhor maneira, só pode ser escalonado. Quando temos muitas linhas de códigos em um arquivo, ou muitos arquivos JS pequenos, pode ser que juntar todos pareça complicar um pouco as coisas.
Há muitos anos existe um sistema que autoriza este processo, permitindo que o _WorkFlow_ seja ideal e, acima de tudo, fácil de manter.

Algumas tarefas que esses gerentes de processos são responsáveis:

1. Combine o código de vários arquivos em um arquivo.

2. Conspilar ou(Transform) ou código. Por exemplo: de _CoffeScript_ ou _TypeScript_ para _JavaScript_ .

3. Minificar ou codificar,

4. Concatene arquivos.

5. Execute os testes automaticamente. ETC...

> Existem vários gerenciadores de processos bons e populares, os mais utilizados são: [Grunt](http://gruntjs.com/), [Gulp!](http://gulpjs.com/) y [Webpack](http://webpack.github.io/). Usaremos _Webpack_, mas você poderia fazer o mesmo com os outros.

Agora o conceito de **modules** também é usado no frontend, para isso são utilizadas bibliotecas como [Browserify]() ou [CommonJS](). Basicamente, ao invés de incluir bibliotecas usando HTML, fazemos isso no próprio JS, então essas bibliotecas que mencionamos são responsáveis ​​por incluir de fato o código necessário para que ela funcione.

Um exemplo no frontend seria mais ou menos assim:

```javascript
//algumModulo.js
module.exports.doSomething = function () {
  return "foo";
};
//algumOutroModulo.js
const someModule = require("someModule");
module.exports.doSomething = function () {
  return someModule.doSomething() + "bar";
};
```

# Vamos Começar

## Com _WEBPACK_

- Vamos começar instalando e configurando o Webpack. Vou esclarecer logo no início que o Webpack é uma ferramenta muito poderosa, portanto complexa, e infelizmente sua documentação não é das melhores. Portanto, a princípio parecerá complexo, mas rapidamente nos apegaremos a todas as coisas que podemos fazer com o Webpack.

```shell
$ npm i -D webpack webpack-cli
```

Como dissemos, Webpack é uma ferramenta que irá aplicar certas _transformações_ ao nosso código, portanto para funcionar o webpack ele precisa saber:

1. Conheça o ponto inicial do nosso aplicativo ou o arquivo javascript raiz.
2. Você deve saber quais transformações deverá fazer no código.
3. Você precisa saber onde salvar o novo código transformado.

Todas essas informações estarão contidas em um arquivo de configuração chamado `webpack.config.js`, que devemos criar na raiz do diretório do nosso projeto. Este arquivo na verdade será um módulo, que exportará um objeto com as configurações do webpack, então poderíamos começar escrevendo o seguinte nesse arquivo:

```javascript
// dentro de webpack.config.js
module.exports = {};
```

Agora começamos a adicionar as informações que mencionamos antes, começamos pelo ponto 1: o ponto de entrada.

```javaScript
module.exports = {
  entry : [
    "./app/index.js"
  ]
}
```

Como você pode ver, os pontos de entrada são definidos dentro do objeto que exportamos com o nome `entry`, e cujo valor é um array. Dentro disso explico os caminhos de todos os arquivos que servem como pontos de entrada do nosso aplicativo. Por enquanto vamos escrever apenas um.

Pois bem, agora para o segundo ponto, temos que definir que tipo de transformações vamos fazer, para isso entram em jogo os `loaders`, estes são os módulos encarregados de realizar as transformações, existem vários tipos de `loaders `, uma vez que a comunidade Cria novos à medida que surgem novas necessidades.

> Para utilizar um carregador é necessário primeiro instalá-lo. Para isso vamos usar `npm`. Por exemplo, se eu quiser usar o `loader` do babel, devo fazer: `npm i -D @babel/core @babel/preset-env @babel/preset-react babel-loader`.

```javascript
module.exports = {
  entry: ["./app/index.js"],
  module: {
    loaders: [
      { test: /\.coffee$/, exclude: /node_modules/, loader: "coffee-loader" },
    ],
  },
};
```

No exemplo, usamos um _coffeeScript_ `loader`. Como você pode ver, também adicionamos uma propriedade chamada `module` que será um objeto dentro do qual aparecerá a propriedade `loaders`, que será um array de objetos. Cada objeto nesta matriz representa uma transformação.

Vemos que este objeto possui três propriedades: `test`, `exclude` e `loader`. A primeira refere-se a quais arquivos devem passar pela transformação, e recebe como valor uma **expressão regular**. No nosso exemplo estamos dizendo que todos os arquivos terminados em `.coffee` passarão pela transformação. O segundo, `exclude` diz ao webpack quais diretórios excluir, em nosso exemplo (e sempre faremos) excluímos `node_modules`, onde sabemos que não haverá código para transformar. Por fim, na propriedade `loader` vamos colocar o nome do loader que queremos utilizar, neste caso o nome é "coffee-loader".

> Sempre procure os carregadores necessários dentro do ecossistema _npm_.

Por último, vamos adicionar onde queremos que o webpack deposite os arquivos após a transformação:

```javascript
module.exports = {
  entry: ["./app/index.js"],
  module: {
    loaders: [
      { test: /\.coffee$/, exclude: /node_modules/, loader: "coffee-loader" },
    ],
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
};
```

Você já pode imaginar o que significam as coisas que adicionamos agora. Ao iniciar uma nova propriedade `output` que contém um objeto, nesta última vamos especificar o nome do arquivo de saída (`filename`) e a pasta onde queremos que ele seja salvo (`path`).

Ok, então vamos tentar reproduzir o mesmo exemplo que fizemos no HTML, mas agora utilizando esse processo. Portanto, a primeira coisa que fazemos é remover o código escrito em React que estava embutido no HTML e passá-lo para um arquivo `js`. A primeira mudança que precisamos fazer é importar os módulos `react` e `react-dom` que solicitamos anteriormente através da tag `script`:

```javascript
import React from "react";
import ReactDOM from "react-dom";

class HelloWorld extends React.Component {
  render() {
    return <div>Hola, Soy Henry!!</div>;
  }
}

function HelloWorldFunction() {
  return <div>Hola, Soy Henry!</div>;
}
ReactDOM.render(<HelloWorld />, document.getElementById("app"));
```

Ótimo, agora precisamos construir os arquivos de configuração do webpack, para que funcione com `babel`. Basicamente temos que transformar o código que usa EcmaScript6 e JSX em JS simples.

```javascript
// webpack.config.js

module.exports = {
  entry: ["./app/index.js"],
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

Por último vamos ter que instalar `npm` para instalar as dependencias:

```shell
$ npm install -D @babel/core @babel/preset-env @babel/preset-react babel-loader
```

```shell
$ npm install react react-dom --save
```

Para executar o webpack, devemos adicionar o seguinte dentro de `scripts` em nosso `package.json`:

```javascript
"scripts": {
    "build": "webpack -w",
}
"devDependencies": {
    "@babel/core": "^7.9.0",
    "@babel/preset-env": "^7.9.0",
    "@babel/preset-react": "^7.9.4",
    "babel-loader": "^8.1.0",
    "webpack": "^4.42.1",
    "webpack-cli": "^3.3.11"
  },
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  }
```

Para testar se tudo funciona bem, iremos até a pasta onde temos todos esses arquivos definidos e escreveremos `npm run build`.

![Webpack](./img/webpack.png)

Se tudo funcionou bem, veremos uma mensagem como a da imagem! E também encontraremos um novo arquivo na pasta `dist`.

Bem, agora finalmente temos que adicionar esse arquivo gerado a um HTML para poder executá-lo:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Descubre React</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./dist/index_bundle.js"></script>
  </body>
</html>
```

Se você abrir este arquivo verá que vemos exatamente a mesma coisa que no primeiro arquivo HTML que criamos. A vantagem desta forma é que temos o código JS separado de todo o resto, podemos ter vários arquivos e o Webpack se encarregará de juntá-los e depositá-los no arquivo de saída.

Ok, agora que já funcionamos e já vimos mais ou menos como escrevê-lo, vamos aprender um pouco mais sobre React.
