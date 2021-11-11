import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Select from './Select';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Images from './Images';

const App = () => {

  return (
    //<Home></Home>
    //<Select></Select>
    <Router>
      <Switch>
        <Route exact path="/" component={Select} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/images" component={Images} />
      </Switch>
    </Router>
  );
}

export default App;
