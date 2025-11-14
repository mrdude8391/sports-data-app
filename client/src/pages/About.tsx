const About = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-svh items-center justify-center">
      <h1>
        An app to record stats for your volleyball players and visualize your
        progress
      </h1>
      <div>
        <h2>Radar chart receiving rating</h2>
        <p>1 -&gt; 0%</p>
        <p>2 -&gt; 50%</p>
        <p>3 -&gt; 100%</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2>Attack rating</h2>
          <p>Avg hitting efficiency percentage</p>
          <p>(kills-errors) / attempts</p>
        </div>

        <div>
          <h2>Block rating</h2>
          <p>
            Average successful (non-error) block touch percentage. Including
            block kills
          </p>
          <p>(Total blocks - block errors) / attempts</p>
        </div>

        <div>
          <h2>Serve rating</h2>
          <p>Average serving success percentage</p>
          <p>(attempts - errors) / attempts</p>
        </div>

        <div>
          <h2>Receive rating</h2>
          <p>
            Average receive rating percentage normalized where a 1 pass is 0 and
            a 3 pass is 100
          </p>
          <p>Total Receive rating / receive attempts</p>
        </div>

        <div>
          <h2>Defense rating</h2>
          <p>
            Defense pass and dig rating rated at 45% each (max possible score of
            90) and error penalty weight is doubled
          </p>
          <p>
            0.45 * ((Average defense rating / 3) * 100) + <br />
            0.45 * ((Total Digs / Defense attempts) * 100) - <br /> 0.9 *
            ((Errors / Defense attempts) * 100))
          </p>
        </div>
        <div>
          <h2>Setting rating</h2>
          <p>Set assist rate percentage</p>
          <p>(Assist - error) / attempts</p>
        </div>
      </div>
    </div>
  );
};

export default About;
