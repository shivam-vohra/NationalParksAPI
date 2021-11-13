import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Select from './Select';
import {HashRouter as Router, Route, Switch } from 'react-router-dom';
import Images from './Images';

/**
 * Main app component that gives the routes for specific pages where the default page
 * is the selection page with buttons for activity selection or image selection.
 * @returns App component
 */
const App = () => {

  return (
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
