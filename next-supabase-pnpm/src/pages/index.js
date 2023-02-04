import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Homepage() {
  const input = useRef({
    // name: "",
    label: "",
    // path: "",
    parent_id: null,
  });
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetch("../api/post_navigation").then((resp) =>
        resp.json()
      );
      setData(data);
    };

    fetchData();
  }, []);

  const handleChange = (type, value) => {
    const newVal = input.current;
    newVal[type] = value;
    input.current = newVal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: input.current }),
    };

    await fetch("../api/post_navigation", requestParams);
  };

  return (
    <>
      <div>
        {data?.map((d) => (
          <ul key={d.id}>
            <li>id: {d.id}</li>
            <li>name: {d.name}</li>
            <li>label: {d.label}</li>
            <li>path: {d.path}</li>
            {d.parent_id && <li>parent_id: {d.parent_id}</li>}
            <br />
          </ul>
        ))}
      </div>

      <section>
        <form onSubmit={handleSubmit}>
          <div></div>
          <br />

          <div>
            <label htmlFor="label">label</label>
            <input
              onChange={({ target: { value } }) => handleChange("label", value)}
              name="label"
            />
          </div>
          <br />

          <div>
            <label htmlFor="parent_id">parent_id</label>
            <input
              onChange={({ target: { value } }) =>
                handleChange("parent_id", value)
              }
              name="parent_id"
            />
          </div>
          <br />

          <button type="submit">submit</button>
        </form>
      </section>
    </>
  );
}
