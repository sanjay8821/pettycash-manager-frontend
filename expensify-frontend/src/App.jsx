import "./App.css";
import { Provider } from "react-redux";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { store } from "./redux/store";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import router from "./routes/routes";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
