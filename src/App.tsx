import "./App.css";
import Workbook from "./components/workbook";
import "./i18n";
import { useEffect, useState } from "react";
import Model, {init} from "./model/model";
import { WorkbookState } from "./components/workbookState";


function App() {
  const [model, setModel] = useState<Model | null>(null);
  const [workbookState, setWorkbookState] = useState<WorkbookState | null>(null);
  useEffect(() => {
    async function start() {
      await init();
      const jsonStr = await (await fetch("./example.json")).text();
      const _model = new Model(jsonStr);

      setModel(_model);
      setWorkbookState(new WorkbookState());
    }
    start();
  }, []);

  if (!model || !workbookState) {
    return <div>Loading</div>;
  }
  
  // We could use context for model, but the problem is that it should initialized to null.
  // Passing the property down makes sure it is always defined.
  return (
    <Workbook model={model} workbookState={workbookState}/>
  );
}

export default App;
