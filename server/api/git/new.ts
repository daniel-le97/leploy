
interface GitHubAppConfig {
  id: number;
  slug: string;
  node_id: string;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  name: string;
  description: string | null;
  external_url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  webhook_secret: string;
  pem: string;
  client_secret: string;
  permissions: {
    contents: string;
    deployments: string;
    metadata: string;
    pull_requests: string;
  };
  events: string[];
}

export default defineEventHandler(async (event) => {
  // console.log('event', event);
  const code = getQuery(event).code
  if (!code)
    throw NOTFOUND

  const conversionUrl = `https://api.github.com/app-manifests/${code}/conversions`
  const fetched = await $fetch<GitHubAppConfig>(conversionUrl, {
    method: 'POST',
  })
  console.log('fetched', fetched)

  return fetched
})
