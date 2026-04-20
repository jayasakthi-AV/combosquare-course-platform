import { useParams } from "react-router-dom";

export default function LearnPage() {
  const { slug } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>🎓 Learning: {slug}</h1>
      <p>Course unlocked successfully ✅</p>
    </div>
  );
}