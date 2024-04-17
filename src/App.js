import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MigrationTool from "./components/interactions/MigrationTool";
import MigrationProcess from "./components/interactions/MigrationProcess";
import Keystore from "./components/interactions/Keystore";
import SimpleTable from "./components/interactions/SimpleTable";
import StartPage from "./components/StartPage";
// import TestComponent from "./components/interactions/TestComponent"

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
  // {
  //   path: "/test",
  //   element: <TestComponent />
  // }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
