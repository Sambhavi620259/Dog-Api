import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SingleDog from "./pages/SingleDog";
import "bootstrap/dist/css/bootstrap.min.css";

 function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<SingleDog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
