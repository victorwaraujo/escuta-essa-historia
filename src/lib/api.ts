export async function toggleLike(episodeId: string, like: boolean) {
    const res = await fetch("/api/episodes/like", {
      method: "POST",
      body: JSON.stringify({ episodeId, like }),
      headers: { "Content-Type": "application/json" },
    })
  
    const data = await res.json()
    return data.likes
  }