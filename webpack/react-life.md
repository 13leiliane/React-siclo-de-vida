# Introdução Hooks

Os Hooks no React foram introduzidos na versão 16.8, eles nos permitem usar estados e outros recursos sem o uso de classes. Estes, além de dificultarem a reutilização e organização do código, podem ser uma grande barreira para o aprendizado do React. Você tem que entender como 'isto' funciona em JavaScript, que é muito diferente de como funciona na maioria das linguagens. Adicionar bind aos manipuladores de eventos geralmente torna o código muito detalhado. Para resolver esses problemas, os Hooks permitem que você use mais recursos sem classe do React. Conceitualmente, os componentes do React sempre estiveram mais próximos das funções. Os Hooks abrangem recursos, mas sem sacrificar o espírito prático do React.

## Estado de um componente

Dissemos que os _props_ eram a _configuração inicial_ do Componente e que não podem ser alterados, que são _imutáveis_. Haverá muitos casos em que um Componente manterá alguns dados dentro de si que podem mudar com o tempo, como o que queremos fazer agora: alterar o nome da saudação. Para fazer isso, cada componente é capaz de manter os dados armazenados no que o React chama de _State_ de um componente. Um Componente será, portanto, capaz de atualizar seu próprio _Estado_ sem restrições.
Para começar, vamos começar dando um _State_ inicial ao Componente, fazemos isso definindo dentro do construtor da classe o `this.state` que será um objeto com todas as propriedades que queremos armazenar como estado interno. Cada propriedade pode armazenar qualquer tipo de dados restantes. Para nosso exemplo, vamos dar como _State_ inicial um objeto que contém a propriedade `name` e que é igual a `this.props.name`, ou seja, vamos fazer de um _prop_ um _state_, isso é porque sabemos que isso mudará no futuro.

Ótimo, já temos _State_, agora a única coisa que precisamos é _mudar_ o _State_ quando o usuário clicar. Para fazer isso teremos que usar uma função chamada `setState`. Não podemos simplesmente atribuir um novo valor a `this.state.name`, isso é para manter a arquitetura do Virtual DOM do react. Vejamos como ficaria o exemplo:

```javascript
import React from "react";
import ReactDOM from "react-dom";

class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name };
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  onButtonClick(e) {
    e.preventDefault();
    const name = this.refs.name.value;
    this.setState({
      name: name,
    });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.onButtonClick}>
          <input type="text" ref="name" />
          <button>Poner Nombre</button>
        </form>
        Hola, {this.state.name}!!
      </div>
    );
  }
}
ReactDOM.render(
  <HelloWorld name="Sou Leiliane" />,
  document.getElementById("app")
);
```

Como podemos ver, agora temos um Componente que gerencia um _State_ interno, que é inicializado usando um _prop_ e que se pretende alterar no futuro.
Seguindo o exemplo usando um componente de função:

```javascript
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

function HelloWorld(props) {
  const nameState = useState(props.name);
  const textInput = useRef(null);

  const onButtonClick = (e) => {
    e.preventDefault();
    const name = textInput.current.value;
    nameState[1](name);
  };
  return (
    <div>
      <form onSubmit={onButtonClick}>
        <input type="text" ref={textInput} />
        <button>Poner Nombre</button>
      </form>
      Hola, {nameState[0]}!!
    </div>
  );
}
ReactDOM.render(
  <HelloWorld name="Sou Leiliane" />,
  document.getElementById("app")
);
```

Aqui vemos o uso do Hook `useState`. Chamamos isso dentro de um componente funcional para adicionar estado local a ele. O React manterá esse estado entre as novas renderizações. useState retorna um array com 2 elementos: o valor do estado atual e uma função que permite atualizá-lo. Você pode chamar esta função de um manipulador de eventos ou de outro lugar. É semelhante a this.setState em uma classe, exceto que não combina o estado antigo e o novo.
O único argumento para useState é o estado inicial. No exemplo acima, é 'props.name'. Observe que, diferentemente de this.state, o estado aqui não precisa ser um objeto — embora possa ser, se você quiser. O argumento do estado inicial é usado apenas durante a primeira renderização.
Agora veremos o mesmo exemplo escrevendo `useState` de uma forma mais compreensível, usando `array destructuring`. Para fornecer ao primeiro valor do array nosso estado inicial e o segundo valor será nossa função para atualizar o estado.

```javascript
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

function HelloWorld(props) {
  const [name, setName] = useState(props.name);
  const textInput = useRef(null);

  const onButtonClick = (e) => {
    e.preventDefault();
    const name = textInput.current.value;
    setName(name);
  };
  return (
    <div>
      <form onSubmit={onButtonClick}>
        <input type="text" ref={textInput} />
        <button>Poner Nombre</button>
      </form>
      Hola, {name}!!
    </div>
  );
}
ReactDOM.render(
  <HelloWorld name="Sou Leiliane" />,
  document.getElementById("app")
);
```

## Componentes de aninhamento

Como dissemos antes, no React _tudo_ é um componente, portanto é lógico pensar que teremos _componentes dentro de componentes_ o tempo todo. Vamos ver com um exemplo como isso funciona e como os dados podem ser passados ​​(no React chamamos isso de _props_) para os componentes.

Agora vamos montar um exemplo um pouco mais complexo, neste teremos dois componentes. Um vai chamar o outro e passar algumas propriedades para ele, vamos ver como fazer:

```javascript
class ContenedorAmigos extends React.Component {
  render() {
    const name = "Sou Leiliane";
    const amigos = ["Guirnalda", "Rodrigues", "Domi", "Vanesa"];
    return (
      <div>
        <h3> Nombre: {name} </h3>
        <MostrarLista names={amigos} />
      </div>
    );
  }
}
```

Neste componente definimos um método `render` um pouco mais complexo, no qual temos duas variáveis ​​(`name` e `friends`) e retornamos um XML que utiliza essas duas variáveis. Como você pode ver, podemos acessar um _prop_ do mesmo Componente usando o `{}`, desta forma `{name}` será substituído por `I'm Leiliane`. Então chamamos um componente que ainda não definimos com o nome `showList` e passamos a ele o array `friends` como uma propriedade. Portanto, dentro de `showList` teremos esse arranjo como um _prop_.

Vamos definir o elemento filho ou _child_:

```javascript
class MostrarLista extends React.Component {
  render() {
    const lista = this.props.names.map((amigo) => <li> {amigo} </li>);
    return (
      <div>
        <h3> Amigos </h3>
        <ul>{lista}</ul>
      </div>
    );
  }
}
```

A primeira coisa que notamos é que usamos _JS_ para criar elementos HTML mais complexos. Neste caso usamos a função `map`, para criar um elemento `<li>` para cada _friend_ na lista ou array.
Olhando para o exemplo anterior usando funções:

```javascript
function ContenedorAmigos() {
  const name = "Sou Leiliane";
  const amigos = ["Guirnalda", "Rodrigues", "Domi", "Vanesa"];
  return (
    <div>
      <h3> Nombre: {name} </h3>
      <MostrarLista names={amigos} />
    </div>
  );
}

function MostrasLista({ names }) {
  const lista = names.map((amigo) => <li> {amigo} </li>);
  return (
    <div>
      <h3> Amigos </h3>
      <ul>{lista}</ul>
    </div>
  );
}
```

Aqui podemos usar `destructuring` para passar os props diretamente com o nome da variável `names`

> Caso você não se lembre de como funciona o map:

```javascript
const amigos = ["Guirnalda", "Rodrigues", "Domi", "Vanesa"];
const lista = amigos.map((amigo) => "<li> " + amigo + "</li>");
console.log(lista); //['<li> Guirnalda</li>', '<li> Rodrigues</li>', '<li> Domi</li>', '<li> Vanesa</li>'];
```

Precisamente esse novo conjunto de `li`s que criamos, vamos usar embrulhados em tags `<ul>` para formar a lista de amigos.

# Tags(Etiquetas) e componentes HTML

Os componentes que criamos no React então os utilizam escrevendo-os como uma tag HTML, na realidade é uma tag [XML] (https://www.quora.com/What-is-the-difference-between-HTML- e-XML) . Por exemplo: a tag `MostrarLista` é um componente que criamos antes e usamos assim:

```html
<div>
  <h3>Nombre: {name}</h3>
  <MostrarLista names="{amigos}" />
</div>
```

Então essa tag será renderizada para tudo o que escrevemos no método `render` desse componente, transformando-o finalmente em HTML.
Existe uma convenção no React para distinguir entre componentes React e elementos HTML nativos. Para o primeiro usamos BumpyCase e minúsculas para o segundo. Por exemplo:

```javaScript
<MostrarLista /> BumpyCase
<div>            lowercase
```

# Separando Componentes

Você provavelmente está pensando que se tivermos Componentes, seria melhor tê-los também em arquivos e pastas diferentes. O bom do React é que ele é TODO JavaScript, então poderemos usar `CommonJS` para exportar componentes como módulos e então requerê-los:

```javascript
import React from "react";

export class Lista extends React.Component {
  render() {
    const lista = this.props.names.map((amigo) => <li> {amigo} </li>);
    return (
      <div>
        <h3> Amigos </h3>
        <ul>{lista}</ul>
      </div>
    );
  }
}
```

Então, no arquivo onde precisamos, simplesmente solicitamos e começamos a usá-lo:

```javascript
import { Lista } from "./MostrarLista.js";
```

Nesse caso, usamos chaves em '{ List }' porque demos um nome à nossa exportação:

```javascript
export class Lista extends React.Component
```

Se fosse uma export default, podemos fazer uma import simples porque informa que é a única coisa que será importada.

```javascript
// Presentational
export default class Lista extends React.Component

// Container
import Lista from './MostrarLista.js';
```

Desta forma poderemos organizar muito bem nossos componentes em diferentes arquivos e pastas.

# React e funções puras

Como acabamos de ver, poderemos usar tudo o que sabemos sobre JS para codificar com React. Vamos pensar desta forma, em vez de ter _funções_ que recebem argumentos e retornam valores e objetos, no React teremos _funções_ que recebem argumentos e retornam **UI (interfaces de usuário-(_user interfaces_))**. Podemos resumir esse conceito como `f(d) = V`, ou seja, uma função recebe argumentos `d` e retorna uma **View**. Essa é uma boa forma de desenvolver interfaces, pois agora toda a sua interface é composta de invocações de funções, que é a forma como estamos acostumados a programar nossas aplicações. Vejamos este conceito em código:

```javascript
const getFoto = function (username) {
  return "https://photo.fb.com/" + username;
};
const getLink = function (username) {
  return "https://www.fb.com/" + username;
};
const getData = function (username) {
  return {
    foto: getFoto(username),
    link: getLink(username),
  };
};
getData("silva");
```

Se olharmos o código acima, notamos que temos três funções e uma invocação de função. Desta forma tornamos o código modular e compreensível. Cada função tem um propósito específico e então as compomos em outra função onde geramos um comportamento que utiliza cada uma delas para alcançar o comportamento que desejamos.

Ok, agora vamos modificar esse código para que ele retorne uma _UI_ em vez de apenas dados:

```javascript
import React from 'React';

class Foto extends React.Component {
  render() {
    return (
      <img src={'https://photo.fb.com/' + this.props.username} />
    )
  }
};

class Link extends React.Component {
  render() {
    return (
      <a href={'https://www.fb.com/' + this.props.username}
        {this.props.username}
      </a>
    )
  }
};

class Avatar extends React.Component {
  render(username) {
    return (
    <div>
      <Foto username={this.props.username}/>
      <Link username={this.props.username}/>
    </div>
  )
};

<Avatar username='silva'/>
```

Agora, em vez de criar funções de composição que retornam dados, estamos compondo funções que retornam _UIs_. Esta ideia é tão importante que o React na versão `0.14` introduziu o que é conhecido como `Stateless Functional Components`, que nos permite escrever o código acima como funções simples.

> Leia [aqui](https://medium.com/@housecor/react-stateless-funcional-components-nine-wins-you-might-have-overlooked-997b0d933dbc#.ev3zuvyvf) o que há de bom nos componentes 'Stateless Functional' `.

Vamos reescrever nosso código usando `Stateless Functional Components`:

```javascript
import React from 'React';

const Foto = function(props) {
  return <img src={'https://photo.fb.com/' + props.username} />
};

const Link = function(props) {
  return (
    <a href={'https://www.fb.com/' + props.username}
      {props.username}
    </a>
  )
}

const Avatar = function(props) {
  return (
    <div>
      <Foto username={props.username}/>
      <Link username={props.username}/>
    </div>
  )
};

<Avatar username='silva'/>
```

Agora, cada componente é o que chamamos de [`pure function`](https://en.wikipedia.org/wiki/Pure_function). Este conceito vem da `Functional Programming`, basicamente, funções puras são consistentes e previsíveis, pois possuem as seguintes características:

- Uma função pura sempre retorna o mesmo resultado para os mesmos argumentos.
- A execução de uma função pura **NO** depende do _estado_ da aplicação.
- Funções puras **NÃO** modificam o estado ou quaisquer variáveis ​​fora de seu escopo.

No React o método `render` precisa ser uma função pura e, portanto, todos os benefícios da programação de funções puras agora são transferidos para sua **UI**. Desta forma conseguimos ter o que no React é conhecido como: `Stateless Functional Components`. Se virmos o exemplo, todos os Componentes que construímos são stateless, e nada mais fazem do que receber dados através de `proprs` e renderizar uma **UI**, isto é, basicamente, Componentes que possuem apenas o método `render`. Disto nasce um paradigma no qual se diferenciam dois tipos de Componentes, os que acabamos de mencionar são os chamados `Presentational Components` e os segundos são os `Containers Components`.

Como você pode imaginar, os `Presentational Components` estão preocupados com a aparência das **coisas** e os `Containers Components` estão preocupados com **como as coisas funcionam**. Organizar nosso código desta forma traz diversas vantagens:

- Melhor separação de tópicos. Você entenderá melhor seu aplicativo e sua UI escrevendo componentes dessa maneira.
- Melhor reutilização. Você pode usar os mesmos componentes de apresentação em contêineres diferentes.
- Você pode ter designers trabalhando em componentes de apresentação sem precisar entrar na lógica do aplicativo.

> Este é apenas um paradigma, certamente existem outros que possuem outras características. Se você quiser ler mais sobre esse paradigma [aqui](https://medium.com/@learnreact/container-components-c0e67432e005#.8fh6laskl).

# Organizando las carpetas de un Proyecto

Antes mencionamos o padrão de separação de Componentes conforme eles mantêm _Estados_ (**Containers**) ou servem apenas para renderizar algo (**Presentational**). Vamos organizar a estrutura de pastas do nosso projeto em torno disso.

Basicamente, vamos salvar cada componente em um arquivo `.js` separado e exportá-lo. O _Presentational_ irá para uma pasta chamada `components`, e os _Containers_ em outra pasta chamada `containers`. Como sabemos, os _Containers_ vão incluir ou _exigir_ o _Presentational_ em seu código, e a partir do código do nosso aplicativo vamos _exigir_ os _Containers_.

> Por convenção vamos chamar os arquivos que contêm um componente com a primeira letra em maiúscula. Por exemplo: `Header.jsx` ou `Profile.js`.

Quando iniciamos um novo projeto React, ao invés de começar do zero, podemos salvar um esqueleto que já contém todas as tarefas que devemos repetir em cada projeto, em inglês isso é conhecido como `boilerplates project`. Na verdade, podemos fazer o nosso próprio 'padrão' ou pesquisar online por um que atenda às nossas necessidades. Em geral, aqueles que são publicados online vêm com muitas coisas que talvez não utilizemos, aqui estão alguns exemplos:

- [react-webpack-boilerplate](https://github.com/KleoPetroff/react-webpack-boilerplate)
- [react-starter-kit](https://github.com/kriasoft/react-starter-kit)
- [react-native-starter](https://github.com/mcnamee/react-native-starter-app)
- [react-webpack-boilerplate](https://github.com/srn/react-webpack-boilerplate)

> Há alguns anos atras foi lançado o [Create React APP](https://github.com/facebookincubator/create-react-app), um mini aplicativo da equipe do Facebook que ajuda você a iniciar um novo projeto React em segundos (não usei ainda). Eu tentei, mas parece interessante!).

Também colocamos nosso próprio exemplo de boilerPlate simplificado [aqui](../boilerplates/ReactBoilerplate). Basicamente ele vem com um arquivo _webpack_ pré-configurado e um mini servidor _express_ para extrair o arquivo da pasta de saída _webpack_, super simples!

> Como sempre, tudo vem em vários _sabores_ e você tem que tentar escolher o que cada um mais gosta, nenhum é o melhor, todos terão prós e contras.

# Propriedades e Estados

Já vimos que no React as propriedades são passadas dos componentes pais para os filhos através da variável `props`. Vejamos algumas propriedades mais avançadas do comportamento de `props`.

# Estado

A outra forma de os Componentes React obterem informações é através do `State`. Este `State` está disponível no objeto `State` de cada Componente, ou seja, podemos acessá-lo através de `this.State`. Os Estados **não** são imutáveis, ou seja, foram concebidos para _mudar_ eventualmente. Precisamente por esse motivo, os componentes que possuem estados têm menor _desempenho_ do que aqueles que não os possuem.

Quando criamos qualquer Componente, seu estado ou `this.State` é igual a `null`, ou seja, ele não possui Estado por padrão! Para adicionar um estado usaremos o método `getInitialState`, que retorna um objeto que contém o estado inicial daquele Componente. Por exemplo:

```javascript
class Componente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "Leili",
      trabajo: "Aprendiz",
    };
  }
  render() {
    return (
      <div>
        Mi nombre es {this.state.nombre}y soy el {this.state.trabajo}.
      </div>
    );
  }
}
ReactDOM.render(<Componente />, document.getElementById("appEstado"));
```

Em um componente de função a nova maneira de ter um `State` é através do Hook `useState` que vimos anteriormente. Continuando com o exemplo anterior:

```javascript
function Componente(props) {
  const [nombre, setNombre] = useState("Leili");
  const [trabajo, setTrabajo] = useState("Aprendiz");

  return (
    <div>
      Mi nombre es {nombre}y soy el {trabajo}.
    </div>
  );
}
ReactDOM.render(<Componente />, document.getElementById("appEstado"));
```

# Atualizando o estado em uma classe

Para atualizar ou alterar o estado de um Componente chamamos a função `this.SetState`, passando-lhe um novo estado através de parâmetros, ou seja, um objeto com as novas propriedades:

```javascript
// Adicionamos este método ao código anterior
...
handleClick() {
  this.setState({
    nombre : "Domi"
  });
}
render() {
  return(
    <div onClick={this.handleClick}>
      Mi nombre es {this.state.nombre}
      , y soy el  {this.state.trabajo}.
    </div>;
  )
}
```

# Atualizando o estado em uma função

Para atualizar o `state` em um componente de função, como vimos, chamamos a função que é retornada pelo Hook `useState`. E passamos o novo `state` como parâmetro. Por exemplo:

```javascript
// Adicionamos este método ao código anterior

const handleClick = () => {
  setNombre("Domi");
}

  return(
    <div onClick={handleClick}>
      Mi nombre es {nombre}
      , y soy el  {trabajo}.
    </div>
  )
}
```

> Quando o estado de um componente é alterado usando `setState` ou o Hook `useState', o React renderiza novamente o componente inteiro. Você tem que tentar fazer isso o mínimo possível!

## Diferença entre estados e props

Certamente você vai se perguntar qual a diferença entre props e states, na realidade ambos mantêm informações ou dados que o Componente irá utilizar. A diferença é o uso de cada um. Os props de um Componente serão passados ​​por seu pai e _deverão_ ser _imutáveis_, ou seja, se os props forem alterados (ou seja, o pai os altera), o Componente deverá ser renderizado novamente com os novos props. Você poderia dizer que props são um tipo de _configuração_ do Componente.

Já os estados são gerenciados exclusiva e internamente por um Componente, não têm nada a ver com o estado dos outros Componentes, ou seja, o estado é _privado_, e os estados **não** são _imutáveis_!

# Reaja aos eventos do ciclo de vida

## O ciclo de vida completo

Como sabemos, é fundamental que uma app tenha estados, ou seja, seja capaz de fazer requisições Ajax, etc... Dissemos que o método render dos Componentes tem que ser _stateless_, ou seja, não seremos capaz de adicionar esse comportamento a ele.
Para isso vamos incorporar o conceito de ciclo de vida do React e seus métodos. Com eles poderemos dar comportamento aos nossos Componentes de acordo com determinados eventos que acontecem em nosso app e em nossos Componentes (por exemplo, quando o Componente é renderizado, ou quando novos dados chegam, etc.).

Na imagem abaixo vemos o ciclo de vida completo de qualquer componente React. Nele também vemos os estados em que um Componente pode estar e quais coisas ou funções irão ativar a passagem de estados e portanto a invocação dos métodos que o React nos fornece:

![LifeCycle](./img/lifecycle.png)

> Você pode consultar este [Gist](https://gist.github.com/fay-jai/fc8a5093c0b5124d4b2d#file-react-lifecycle-parent-child-jsx) e testá-lo localmente para entender melhor _quando_ cada O método é invocado do React.

Vejamos alguns desses eventos, primeiro vamos separá-los em duas categorias que cobrem a maioria deles:

- Quando um componente é montado ou desmontado no DOM.
- Quando um Componente recebe novos dados.

### Montagem/Desmontagem

Quando um componente é adicionado ao DOM dizemos que foi montado e quando é removido do DOM dizemos que foi desmontado. Por definição, esses eventos são chamados pelo React _apenas_ uma vez no ciclo de vida do Componente (quando ele 'nasce' e quando 'morre'). Portanto, eles nos ajudarão a definir certas condições iniciais de um Componente ou fechar ou eliminar certos listeners que atendiam apenas o Componente em questão. Em geral, na maioria das vezes faremos o seguinte nestes Eventos:

- Defina alguns _props_ padrão.
- Estabeleça alguns Estados iniciais do Componente.
- Faça alguma solicitação AJAX para trazer os dados necessários para o Componente.
- Crie ouvintes, se necessário.
- Remova ouvintes que não são mais úteis.

Para aproveitar esses Eventos, o React nos fornece uma série de métodos que são invocados dependendo do momento do ciclo de vida do Componente. Dentro desses métodos adicionaremos a funcionalidade necessária para nosso componente.

### Definir props padrão

Várias vezes teremos Componentes que serão usados ​​para várias coisas, portanto, quando os instanciarmos, vamos querer dar-lhes _props_ diferentes por padrão (esses props são usados ​​se não passarmos um em particular) . Para fazer isso, o React nos fornece o método `defaultProps`, no qual atribuímos a um objeto os _props_ que nosso Componente finalmente terá quando for renderizado, por exemplo:

```javascript
class Cargando extends React.Component {
  constructor(props) {
    super(props);
    ...
  }
  render() {
    ...
  }
};

Cargando.defaultProps = {
  text: 'cargando...',
}
```

Assim como em uma aula, temos o exemplo em uma `function`:

```javascript
function Cargando(props) {
  return (
    ...
  )
}

Cargando.defaultProps = {
  text: 'cargando...',
}
```

Neste exemplo, se não passarmos o _prop_ `text` para o componente `cargando`, ele assumirá o valor padrão: `cargando...`.

### Defina um estado inicial

Quando queremos que nosso Componente gerencie algum tipo de Estado temos que definir seu _Estado Inicial_. Podemos conseguir isso a partir do construtor usando `this.state`, que atribui a um objeto o estado inicial. Será chamado quando o componente for montado no DOM pela primeira vez.

```javascript
class Login extends React.Components{
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }
  render() {
    ...
  }
};
```

Ao usar um componente de função, definimos o _Estado inicial_ com o gancho `useState`, onde o primeiro elemento do array retornado é o nosso estado e o segundo é uma função para alterar o estado:

```javascript
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    ...
  )
};
```

#### Faça alguma solicitação AJAX para trazer os dados necessários para o Componente.

Este é um caso muito comum, o Componente necessita de dados que são trazidos através de uma requisição do tipo AJAX. Em um componente de classe, React nos fornece o método `componentDidMount`, este método é chamado logo após o componente ser montado no DOM:

```javascript

class Lista extends React.Component {
  componentDidMount() {
    return Axios.get(this.props.url).then(this.props.callback) // AJAX request con Axios
  }
  render() {
    ...
  }
};
```

Ao usar uma função, introduzimos o gancho `useEffect`. Este recebe um callback que é executado após cada renderização no componente e nos permite fazer solicitações de dados, estabelecer assinaturas e atualizar manualmente o DOM nos componentes React. Geralmente chamamos essas operações de “efeitos colaterais” (ou simplesmente “efeitos”). Este Hook é equivalente aos ciclos de vida da classe: componentDidMount, componentDidUpdate e componentWillUnmount combinados. O segundo argumento que ele recebe é um `array`, ao passar um array vazio `[]`, isso diz ao React que `useEffect` não depende de nenhum valor vindo dos props ou estado, portanto não precisa repetir a execução.

```javascript
function Lista(props) {
  useEffect(() => {
    Axios.get(props.url).then(props.callback) // AJAX request con Axios
  },[])

  return (
    ...
  )
};
```

### Crie olisteners, se necessário

Como você pode imaginar, também faremos isso usando o métodoe o `componentDidMount` Hook `useEffect`:

`useEffect`:

```javascript

class Lista extends React.Component {
  componentDidMount() {
    ee.on('evento', () => this.setState({ ... }) // creamos un event listener para un 'evento'
  }
  render() {
    ...
  }
};
```

```javascript

function Lista() {
  const [state, setState] = useState({})
  useEffect(() => {
    ee.on('evento', () => setState({ ... }) // creamos un event listener para un 'evento'
  },[])

  return (
    ...
  )
};
```

### Remova listeners que não são mais úteis.

Da mesma forma, existe o método `componentWillUnmount` que é chamado logo antes de remover o componente do DOM:

```javascript
class FriendsList extends React.Component {
  componentWillUnmount() {
    ee.off() //sacamos el listener que habiamos puesto.
  }
  render() {
    ...
  }
};
```

No caso de uma função, usamos o mesmo Hook, `useEffect`. Você pode estar pensando que precisaríamos de um efeito separado para realizar a remoção do evento. Mas o código para adicioná-lo e removê-lo está tão intimamente relacionado que useEffect foi projetado para mantê-lo unido. Se o seu efeito retornar uma função, o React irá executá-la no momento correto:

```javascript
function FriendList() {
  const [state, setState] = useState({})
  useEffect(() => {
    ee.on('evento', () => setState({ ... })

    return () => {
      ee.off() //sacamos el listener que habiamos puesto.
    };
  },[])

  return (
  ...
  )
};
```

Neste caso, quando retornamos uma função em `useEffect`, ela é executada antes que o componente seja removido da UI.

### Eventos quando o componente recebe novos dados

O primeiro método que veremos é `componentWillReceiveProps`, este evento é acionado quando o Componente recebe novos _props_.

O segundo e mais avançado é `shouldComponentUpdate`. Já sabíamos que o React dá muita importância à re-renderização de novos Componentes (pois isso implica muito trabalho para o cliente), portanto nos dá este método para que possamos controlar este comportamento. Precisamente, `shouldComponentUpdate` retorna um **Boolean**, se for `true`, então o Componente (e, portanto, todos os seus filhos) será renderizado novamente, se for `false` nada disso será feito.

No caso em que temos um componente de função. Usaremos o gancho `useEffect` para o primeiro caso. Este Hook pode receber um array `[]` como segundo parâmetro. Por exemplo:

```javascript
function Ejemplo() {
  const [name, setName] = useState("Leili");
  useEffect(() => {
    document.title = name;
  }, [name]);

  return (
    <input value={name} onChange={(event) => setName(event.target.value)} />
  );
}
```

No exemplo acima, não precisamos atualizar o título do documento (nosso efeito) após cada renderização, mas apenas quando o nome da variável de estado muda de valor. É por isso que passamos array com o valor `name` como segundo parâmetro:
Aqui, se quisermos que nosso Hook seja invocado somente após a primeira renderização, temos que passar um array vazio [] (que nunca muda) como segundo parâmetro.
No segundo caso podemos utilizar `React.memo` que é um HOC (High Order Component) que auxilia no desempenho de renderização de um componente, evitando uma nova renderização. Se um componente retornar o mesmo resultado, ou seja, suas props não mudam. Envolver o componente em `React.memo` pode ajudar muito no desempenho. Esta função pode receber como segundo argumento uma função de comparação customizada, que recebe os props antigos e novos. Se retornar verdadeiro, a atualização será ignorada. Por exemplo:

```javascript
function Ejemplo(props) {
  return <div>{props.name}</div>;
}

const fnComparacion = function (prevProps, nextProps) {
  return prevProps.name === nextProps.name;
};

export default React.memo(Ejemplo, fnComparacion);
```
