import { LineChart, Line } from "recharts";

const data = [
  { name: "Jan", users: 4000 },
  { name: "Feb", users: 3000 },
  { name: "Mar", users: 2000 },
  { name: "Apr", users: 2780 },
  { name: "May", users: 1890 },
  { name: "Jun", users: 2390 },
  { name: "Jul", users: 3490 },
];

const AthleteStatChart = () => {
  //   const [data, setData] = useState([]);

  //   const convertStats = (stats: Stat[]) => {
  //     const data = stats.map((stat) => {});
  //     return data;
  //   };

  //   useEffect(() => {
  //     console.log(stats);
  //   }, []);

  return (
    <LineChart width={600} height={300}>
      <Line type="monotone" dataKey="users" />
    </LineChart>
  );
};

export default AthleteStatChart;
