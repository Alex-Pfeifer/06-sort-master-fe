import { useEffect, useState } from "react";

interface Container {
  id: string;
  color: string;
  name: string;
  description: string;
}

const ContainerList = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [itemInputs, setItemInputs] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/containers")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(setContainers)
      .catch((err) => setError(err.message));
  }, []);

  const handleInputChange = (containerId: string, value: string) => {
    setItemInputs((prev) => ({ ...prev, [containerId]: value }));
  };

  const handleAddItem = async (containerId: string) => {
    const name = itemInputs[containerId];
    if (!name) return;

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          name,
          containerId: parseInt(containerId),
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");
      setMessage(`Item added to container ${containerId}!`);
      setItemInputs((prev) => ({ ...prev, [containerId]: "" }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Error adding item.");
    }
  };

  const handleRemoveContainer = async (containerId: string) => {
    try {
      const res = await fetch(`/api/containers/${containerId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete container");

      setContainers((prev) =>
        prev.filter((container) => container.id !== containerId)
      );
      setMessage(`Container ${containerId} removed.`);
    } catch (err) {
      setMessage("Error removing container.");
    }
  };

  if (error)
    return <div className="text-red-500">Error loading containers.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rubbish Containers</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <ul className="space-y-6">
        {containers.map((container) => (
          <li
            key={container.id}
            className="p-4 rounded-lg shadow-md text-white"
            style={{ backgroundColor: container.color }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{container.name}</h3>
                <p>{container.description}</p>
              </div>
              <button
                onClick={() => handleRemoveContainer(container.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>

            <div className="mt-4 space-y-2 input-group mask-b-from-9">
              <input
                type="text"
                placeholder="New item name"
                className="p-2 rounded text-black w-full"
                value={itemInputs[container.id] || ""}
                onChange={(e) =>
                  handleInputChange(container.id, e.target.value)
                }
              />
              <button
                onClick={() => handleAddItem(container.id)}
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
              >
                Add Item
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContainerList;
