import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const DetailsPage = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const data = await response.json();
        setArtwork({
          title: data.title,
          image: data.primaryImage || data.primaryImageSmall,
          artist: data.artistDisplayName || "Unknown Artist",
          description: data.objectName,
          medium: data.medium,
          department: data.department,
          culture: data.culture,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [id]);

  if (loading) return <p>Loading artwork details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>{artwork.title}</h1>
      <img src={artwork.image} alt={artwork.title} width="400" />
      <p><strong>Artist:</strong> {artwork.artist}</p>
      <p><strong>Description:</strong> {artwork.description}</p>
      <p><strong>Medium:</strong> {artwork.medium}</p>
      <p><strong>Department:</strong> {artwork.department}</p>
      <p><strong>Culture:</strong> {artwork.culture}</p>
      <Link to="/">Back to Gallery</Link> {/* 🔹 Navigation back to home */}
    </div>
  );
};

export default DetailsPage;