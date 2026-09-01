export default function sitemap() {
  const baseUrl = "https://fudever.com";
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hall-of-fame`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/activity`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/project-lab`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/member`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alumni`,
      lastModified: new Date(),
      priority: 0.6,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      priority: 0.6,
    },
  ];
}
