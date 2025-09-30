const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error fetching access token:", data);
    throw new Error(data.error_description || "Failed to fetch access token");
  }

  return data.access_token as string;
};

export const getArtistAlbums = async (artistId: string) => {
  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Error fetching albums:", data);
    throw new Error(data.error?.message || "Failed to fetch albums");
  }

  return data.items;
};