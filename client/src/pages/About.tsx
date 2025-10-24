import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const About = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>
        An app to record stats for your volleyball players and visualize your
        progress
      </h1>
      <h2>Radar chart receiving rating</h2>
      <p>1 -&gt; 0%</p>
      <p>2 -&gt; 50%</p>
      <p>3 -&gt; 100%</p>
    </div>
  );
};

export default About;
