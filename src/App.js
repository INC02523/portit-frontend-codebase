import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MigrationTool from "./components/interactions/MigrationTool";
import MigrationProcess from "./components/interactions/MigrationProcess";
import Keystore from "./components/interactions/Keystore";
import SimpleTable from "./components/interactions/SimpleTable";
import StartPage from "./components/StartPage";
import { PayloadComparison } from "./components/interactions/PayloadComparasion";
import { XmlFileComparer } from "./components/interactions/XmlFileComparer";
import { JsonFileComparer } from "./components/interactions/JsonFileComparer";

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
  {
    path: '/payload-comparison',
    element: <PayloadComparison />,
  },
  {
    path: '/payload-comparison/xml-comparer',
    element: <XmlFileComparer />,
  },
  {
    path: '/payload-comparison/json-comparer',
    element: <JsonFileComparer />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
