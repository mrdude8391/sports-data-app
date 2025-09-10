import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex flex-col h-screen items-center justify-center">
        <Button onClick={() => setCount((count) => (count += 1))}>
          Count is {count}
        </Button>
      </div>
    </>
  );
}

export default App;
