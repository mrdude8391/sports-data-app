import { Button } from "@/components/ui/button";
import { test } from "../services/sportsDataService";
import { useState } from "react";

const Test = () => {
  const [status, setStatus] = useState<number | null>(null);

  return (
    <div>
      Test
      <div className="card-container sm:w-2xl flex flex-col gap-4 justify-center">
        <h1>Api Test</h1>
        <Button
          onClick={async () => {
            try {
              const res = await test();
              console.log("Home test button response", res);
              setStatus(res.status);
            } catch (error: any) {
              console.log(error);
            }
          }}
        >
          Test
        </Button>
        {status && <div>{status}</div>}
      </div>
    </div>
  );
};

export default Test;
