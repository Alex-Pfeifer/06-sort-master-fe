
import { useEffect, useState } from "react";

interface Item {
    name: string;
    container: {
        color: string;
        name: string;
        description: string;
    };
}

export default function Items() {
    const [items, setItems] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/items")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch items");
                return res.json();
            })
            .then((data) => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setItems(sorted);
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="pb-20 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">All Items</h1>
            <ul className="space-y-4 bg-blue-100">
                {items.map((item, idx) => (
                    <li
                        key={idx}
                        className="p-4 rounded-lg shadow text-white "
                        style={{ backgroundColor: item.container?.color || "#5555" }}
                    >
                        <div className="font-semibold text-lg">{item.name}</div>
                        <div className="text-sm">
                            Container.id: {item.container?.name || "Unknown"}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
}
