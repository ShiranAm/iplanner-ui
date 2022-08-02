import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SideBar from "./Components/SideBar/SideBar";
import SiteData from "./Components/SiteData/SiteData"
import './App.css'

function App() {
  return (
      <>
        <Router>
           <SideBar />
            <Routes>
                <Route exact path='/'/>
                <Route exact path='/site-data' element={<SiteData />}></Route>
            </Routes>
        </Router>
      </>
  )
}


export default App;
