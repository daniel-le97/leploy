export default defineAppConfig({
  title: 'Leploy',
  docus: {
    title: 'Leploy',
    titleTemplate: '%s - Leploy',
    description: 'The best place to start your documentation.',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
    socials: {
      // twitter: 'nuxt_js',
      github: 'daniel-le97/leploy',
      // nuxt: {
      //   label: 'Nuxt',
      //   icon: 'simple-icons:nuxtdotjs',
      //   href: 'https://nuxt.com',
      // },
    },
    github: {
      dir: 'docs',
      branch: 'main',
      repo: 'leploy',
      owner: 'daniel-le97',
      edit: true,
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      title: 'Leploy',
      logo: false,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  },
})
