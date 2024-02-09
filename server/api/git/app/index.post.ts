export default defineEventHandler(async (event) => {
  const location = 'http://localhost:3000'
  const manifest = {
    name: 'le-ploy-source-1',
    description: 'test',
    hook_attributes: {
      url: 'https://smee.io/2CheYVHetZe4ROm',
    },
    public: true,
    url: location, // Assuming loc is defined
    redirect_url: location, // Assuming loc is defined
    default_events: ['deployment', 'pull_request', 'push'],
    default_permissions: {
      contents: 'read',
      deployments: 'write',
      metadata: 'read',
      pull_requests: 'read',
    },
  }
  return sendRedirect(event, `https://github.com/settings/apps/new?state=abc123&manifest=${encodeURIComponent(JSON.stringify(manifest))}`)
})
