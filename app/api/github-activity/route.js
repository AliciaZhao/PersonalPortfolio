export const revalidate = 60; // cache for 60s (ISR-style)

const USER = process.env.GITHUB_USERNAME; // e.g. "octocat"
const TOKEN = process.env.GITHUB_TOKEN || ""; // optional, increases rate limit

export async function GET() {
  if (!USER) {
    return new Response(JSON.stringify({ error: "Missing GITHUB_USERNAME" }), { status: 400 });
  }

  const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
  const url = `https://api.github.com/users/${encodeURIComponent(USER)}/events`;

  const res = await fetch(url, { headers, next: { revalidate } });
  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: text }), { status: res.status });
  }

  const events = await res.json();

  // Keep only PushEvent, flatten some fields, limit to recent 10 pushes
  const pushes = events
    .filter(e => e.type === "PushEvent")
    .slice(0, 10)
    .map(e => ({
      id: e.id,
      repo: e.repo?.name,
      branch: (e.payload?.ref || "").replace("refs/heads/", ""),
      commitCount: e.payload?.size || 0,
      commits: (e.payload?.commits || []).slice(0, 3).map(c => ({
        sha: c.sha,
        msg: c.message,
        url: c.url?.replace("api.github.com/repos", "github.com")
                   ?.replace("/commits/", "/commit/"),
      })),
      ts: e.created_at,
    }));

  return Response.json({ pushes });
}
