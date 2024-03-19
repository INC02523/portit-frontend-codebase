import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MigrationTool from "./components/MigrationTool";
import MigrationProcess from "./components/MigrationProcess";
import Keystore from "./components/Keystore";
import SimpleTable from "./components/SimpleTable";
import StartPage from "./components/StartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },

  {
    path: "/home",
    element: <Home />,
  },

  {
    path: "/migration-tool",
    element: <MigrationTool />,
  },
  {
    path: "/migration-process",
    element: <MigrationProcess />,
  },
  {
    path: "/keystore",
    element: <Keystore />,
  },
  {
    path: "/simpletable",
    element: <SimpleTable />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
