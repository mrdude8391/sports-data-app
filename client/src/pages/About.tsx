const About = () => {
  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center">
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
          <p>Percentage chance that the player will get a kill and not error</p>
          <p>(kills-errors) / attempts</p>
        </div>

        <div>
          <h2>Block rating</h2>
          <p>
            Percentage chance that the player will get a block touch that is not
            an error. Including block kills
          </p>
          <p>(Total blocks - block errors) / attempts</p>
        </div>

        <div>
          <h2>Serve rating</h2>
          <p>
            Percentage chance that the player will serve successfully without
            error
          </p>
          <p>(attempts - errors) / attempts</p>
        </div>

        <div>
          <h2>Receive rating</h2>
          <p>Percentage chance that the player will make a perfect 3 pass</p>
          <p>Total Receive rating /(3 * receive attempts)</p>
        </div>

        <div>
          <h2>Defense rating</h2>
          <p>
            Percentage chance that the player will pass perfectly on defense
            (including free ball) or get a dig, and not error
          </p>
          <p>
            0.45 * ((Average defense rating / 3) * 100) + <br />
            0.45 * ((Total Digs / Defense attempts) * 100) - <br /> 0.9 *
            ((Errors / Defense attempts) * 100))
          </p>
        </div>
        <div>
          <h2>Setting rating</h2>
          <p>
            Percentage chance that the players set will result in a kill and not
            error
          </p>
          <p>(Assist - error) / attempts</p>
        </div>
      </div>
    </div>
  );
};

export default About;
