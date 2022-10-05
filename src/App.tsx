import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';

// const HomeScreen = lazy(() => import('./components/home/Home'));
// const BooksScreen = lazy(() => import('./components/books/Books'));
// const CartScreen = lazy(() => import('./components/cart/Cart'));

import Home from './components/home/Home';
import Books from './components/books/Books';
import Cart from './components/cart/Cart';
import PageNotFound from './components/404/PageNotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/books">
          <Books />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
