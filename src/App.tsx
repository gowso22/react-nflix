import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Routes/Header';


function App() {
  return (
    <Router>
      <Header></Header>
      <Routes>
        <Route path = {`${process.env.PUBLIC_URL}/`} element = {<Home/>}></Route>
        <Route path = {`${process.env.PUBLIC_URL}/tv`} element = {<Tv/>}></Route>
        <Route path = {`${process.env.PUBLIC_URL}/search`} element = {<Search/>}></Route>
        <Route path= {`${process.env.PUBLIC_URL}/movies/:id`} element ={<Home/>}/>
        <Route path= {`${process.env.PUBLIC_URL}/tv/tvs/:id`} element ={<Tv/>}/>
      </Routes>
    </Router>
  );
}

export default App;
