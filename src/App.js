import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MigrationTool from "./components/interactions/MigrationTool";
import MigrationProcess from "./components/interactions/MigrationProcess";
import Keystore from "./components/interactions/Keystore";
import SimpleTable from "./components/interactions/SimpleTable";
import StartPage from "./components/StartPage";
import { PayloadComparison } from "./components/interactions/PayloadComparasion";
import MigrationProcessTest from "./components/interactions/MigrationProcessTest";
import { toast } from "react-toastify";
import StartPageTwo from "./components/StartPageTwo";



const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPageTwo/>,
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
  {
    path: '/payload-comparison',
    element: <PayloadComparison />,
  },
  {
    path: '/migrationProcess',
    element: <MigrationProcessTest />
  }
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
