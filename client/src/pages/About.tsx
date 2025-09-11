import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const About = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button onClick={() => setCount((count) => (count += 1))}>
        Count is {count}
      </Button>

      <Button>
        <a href="/login"> login</a>
      </Button>
    </div>
  );
};

export default About;
