export default oauth.githubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        github: user,
      },
      loggedInAt: Date.now(),
    })
    console.log('github:success', user);
    
    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.log('github:error', error);
    
  }
})
