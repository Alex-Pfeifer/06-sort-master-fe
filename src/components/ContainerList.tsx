import { useEffect, useState } from "react";

interface Container {
  id: string;
  color: string;
  name: string;
  description: string;
}

const ContainerList = () => {
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/containers")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(setContainers)
      .catch(setError);
  }, []);

  if (error)
    return <div className="text-red-500">Error loading containers.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rubbish Containers</h2>
      <ul className="space-y-4">
        {containers.map((container: Container) => (
          <li
            key={container.id}
            className="p-4 rounded-lg shadow-md text-white"
            style={{ backgroundColor: container.color }}
          >
            <h3 className="text-xl font-semibold">{container.name}</h3>
            <p>{container.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContainerList;


