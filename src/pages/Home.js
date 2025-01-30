import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [numArtworks, setNumArtworks] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); //Navigation function

  const handleChange = (event) => {
    setNumArtworks(event.target.value);
  };

  const fetchArtworks = async () => {
    if (numArtworks <= 0) {
      setError("Please enter a number greater than 0.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const searchUrl = "https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting";
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) throw new Error(`Failed to fetch: ${searchResponse.status}`);

      const searchData = await searchResponse.json();
      if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
        throw new Error("No artworks found.");
      }

      const selectedIDs = searchData.objectIDs.slice(0, numArtworks);
      const artworkDetails = await Promise.all(
        selectedIDs.map(async (id) => {
          const detailsResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
          if (!detailsResponse.ok) return null;

          const details = await detailsResponse.json();
          return {
            id,
            title: details.title,
            image: details.primaryImageSmall || details.primaryImage,
            artist: details.artistDisplayName || "Unknown Artist",
          };
        })
      );

      setArtworks(artworkDetails.filter((art) => art.image));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ford's Gallery</h1>
      <p>Enter the number of artworks you want to see:</p>
      <input type="number" value={numArtworks} onChange={handleChange} min="1" step="1" placeholder="Enter a number" />
      <button onClick={fetchArtworks}>Fetch Artworks</button>

      {loading && <p>Loading artworks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
        {artworks.map((art) => (
          <div key={art.id} style={{ textAlign: "center", width: "200px", cursor: "pointer" }}
               onClick={() => navigate(`/artwork/${art.id}`)}> 
            <img src={art.image} alt={art.title} width="200" height="200" style={{ borderRadius: "10px" }} />
            <p><strong>{art.title}</strong></p>
            <p>{art.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;