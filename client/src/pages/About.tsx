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
    </div>
  );
};

export default About;
