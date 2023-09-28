import Form from "./components/Form";
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <Routes>
      <Route path="/reset-password" Component={Form} />
    </Routes>
  );
}

export default App;
