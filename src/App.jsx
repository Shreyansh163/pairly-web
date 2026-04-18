import { BrowserRouter, Route, Routes } from "react-router";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";


function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <h1 class="text-3xl font-bold underline">Hello World!</h1>
    </>
  );
}

export default App;
