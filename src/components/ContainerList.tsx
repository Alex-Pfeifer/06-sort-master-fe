import { useEffect, useState, type FormEvent } from "react";

interface Container {
    id: string;
    color: string;
    name: string;
    description: string;
}

const ContainerList = () => {
    const [containers, setContainers] = useState<Container[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [newItemName, setNewItemName] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetch("/api/containers")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(setContainers)
            .catch(() => setError("Error loading containers."));
    }, []);

    const handleDelete = (id: string) => {
        setError(null);
        setMessage(null);
        fetch(`/api/containers/${id}`, { method: "DELETE" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete container");
                setContainers((prev) => prev.filter((container) => container.id !== id));
                setMessage("Container successfully deleted.");
            })
            .catch(() => setError("Error deleting container."));
    };

    const handleAddItem = (e: FormEvent, containerId: string) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const itemName = newItemName[containerId]?.trim();
        if (!itemName) {
            setError("Item name cannot be empty.");
            return;
        }

        fetch(`/api/containers/${containerId}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: itemName }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to add item");
                return res.json();
            })
            .then((newItem) => {
                setMessage(`Item "${newItem.name}" added to container.`);
                setNewItemName((prev) => ({ ...prev, [containerId]: "" }));
            })
            .catch(() => setError("Error adding item."));
    };

    const handleInputChange = (containerId: string, value: string) => {
        setNewItemName((prev) => ({ ...prev, [containerId]: value }));
    };

    if (error)
        return <div className="text-red-500 mb-4">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Rubbish Containers</h2>
            {message && <div className="mb-4 text-green-600">{message}</div>}
            <ul className="space-y-4">
                {containers.map((container: Container) => (
                    <li
                        key={container.id}
                        className="p-4 rounded-lg shadow-md text-white relative"
                        style={{ backgroundColor: container.color }}
                    >
                        <button
                            onClick={() => handleDelete(container.id)}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                            aria-label={`Remove container ${container.name}`}
                        >
                            Remove
                        </button>
                        <h3 className="text-xl font-semibold">{container.name}</h3>
                        <p>{container.description}</p>

                        <form
                            className="mt-6 bg-red-400 bg-opacity-90 p-3 rounded shadow-md max-w-md"
                            onSubmit={(e) => handleAddItem(e, container.id)}
                        >
                            <input
                                type="text"
                                placeholder="New item name"
                                value={newItemName[container.id] || ""}
                                onChange={(e) => handleInputChange(container.id, e.target.value)}
                                className="rounded p-3 mr-6 w-full text-black placeholder-gray-950 border border-b-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="mt-2 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Item
                            </button>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContainerList;
