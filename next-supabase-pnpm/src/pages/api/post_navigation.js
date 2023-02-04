import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const generateName = async (label, existingLabelCount) => {
  let name = label
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

  if (existingLabelCount) return `${name}-${existingLabelCount}`;
  else return name;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const { label, parent_id: parentId } = req.body.data;

    try {
      const { data } = await supabase
        .from("post_navigation")
        .select("*", { count: "exact" })
        .or(`id.eq.${parentId},parent_id.eq.${parentId}`);

      const parentData = data.find((e) => e.id === Number(parentId));
      const childrenData = data.filter((e) => e.parent_id === Number(parentId));

      const existingLabelCount = childrenData.filter(
        (e) => e.label === label
      )?.length;

      const name = await generateName(label, existingLabelCount);
      const path = `${parentData.path}/${name}`;

      await supabase.from("post_navigation").insert({
        name,
        label,
        path,
        parent_id: parentId,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  } else {
    try {
      const { data } = await supabase.from("post_navigation").select("*");
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
    // Handle any other HTTP method
  }
}
