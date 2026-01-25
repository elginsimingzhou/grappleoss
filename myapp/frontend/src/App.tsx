import { useEffect, useState } from "react";
import GraphUI from "./components/graphs_ui/GraphUI";

type HelloResponse = { message: string };

export default function App() {
  const [msg, setMsg] = useState<string>("Loading....");

  useEffect(() => {
    fetch("/api/hello?name=Elgin")
      .then((r) => r.json() as Promise<HelloResponse>)
      .then((data) => setMsg(data.message))
      .catch(() => setMsg("Error fetching message"));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <GraphUI/>
    </div>
  );
}
