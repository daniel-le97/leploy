<script setup>
const SideNavBar = ref(null)
const isCollapsed = ref(false)

function handleCollapse() {
  if (SideNavBar.value) {
    isCollapsed.value = !isCollapsed.value
    const newWidth = isCollapsed.value ? '15rem' : '5rem'

    SideNavBar.value.style.width = newWidth
    SideNavBar.value.style.transition = 'width 0.3s ease'
  }
}

const navItems = [
  // {
  //   link: '/',
  //   icon: 'uil:home',
  //   label: 'Home',
  //   auth: true,

  // },
  {
    link: '/projects',
    // icon: 'material-symbols:add-box-outline',
    icon: 'uil:home',
    label: 'Projects',
    auth: true,
  },
  // {
  //   link: '/providers/portainer',
  //   icon: 'uil:apps',
  //   label: 'Portainer',
  //   auth: true,

  // },
  // {
  //   link: '/providers/caprover',
  //   icon: 'ri:apps-2-fill',
  //   label: 'Caprover',
  //   auth: true,
  // },
  {
    link: '/login',
    icon: 'material-symbols:login-rounded',
    label: 'logout',
    auth: false,
  },

]

const items = ref(navItems)

// const auth = useAuth()
// const dontShow = computed(() => {
//   if (!auth.loggedIn)
//     items.value.filter(item => !item.auth)
// })

// const computedItems = computed (() => {
//   // console.log(auth.loggedIn);

//   if (auth.loggedIn.value) {
//     // If authenticated, filter items with auth: true or items without auth property
//     return navItems.filter(item => item.auth === true)
//   }
//   else {
//     // If not authenticated, filter items without auth property
//     return navItems.filter(item => item.auth === false)
//   }
// })

// watch(auth.loggedIn, () => {
//   console.log('auth changed');

//   items.value = navItems.filter(item => item.auth === Boolean(auth.loggedIn))
// })
</script>

<template>
  <div ref="SideNavBar" class="flex flex-col items-center justify-between w-20 h-full bg-gray-800 text-white ">
    <div class=" flex flex-col  w-full  justify-center items-center ">
      <UTooltip v-for="navItem in items" :key="navItem.label" :text="navItem.label" :popper="{ placement: 'right' }" class="group">
        <NuxtLink :to="navItem.link" class="flex items-center justify-center  hover:dark:bg-zinc-500/10 transition-all duration-200" active-class="active">
          <RippleBtn>
            <Icon :name="navItem.icon" class="text-5xl group-hover:text-emerald-100" />
          </RippleBtn>
        </NuxtLink>
      </UTooltip>
    </div>
  </div>
</template>

<style scoped>
.active{
@apply text-emerald-400 bg-gray-200/20 cursor-pointer
}
</style>
