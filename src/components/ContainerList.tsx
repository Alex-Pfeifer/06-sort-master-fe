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
    const [message, setMessage] = useState<string | null>(null);

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
        fetch(`/api/containers/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete container");
                // Удаляем контейнер из состояния
                setContainers((prev) => prev.filter((container) => container.id !== id));
                setMessage("Container successfully deleted.");
            })
            .catch(() => setError("Error deleting container."));
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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContainerList;
