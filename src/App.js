import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SideBar from "./Components/SideBar/SideBar";
import SiteData from "./Components/SiteData/SiteData";
import Problems from "./Components/Problems/Problems";
import HomePage from "./Components/HomePage/HomePage";
import './App.css'

function App() {
  return (
      <>
        <Router>
           <SideBar />
            <Routes>
              <Route exact path='/' element={<HomePage />}></Route>
              <Route exact path='/site-data' element={<SiteData />}></Route>
              <Route exact path='/problems' element={<Problems />}></Route>
            </Routes>
        </Router>
      </>
  )
}


export default App;
