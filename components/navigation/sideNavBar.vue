<script setup lang="ts">
const SideNavBar = ref < HTMLElement | null > (null)
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
  {
    link: '/',
    icon: 'uil:home',
    label: 'Home',
    auth: true,

  },
  {
    link: '/projects',
    icon: 'material-symbols:add-box-outline',
    label: 'Projects',
    auth: true,
  },
  {
    link: '/providers/portainer',
    icon: 'uil:apps',
    label: 'Portainer',
    auth: true,

  },
  {
    link: '/providers/caprover',
    icon: 'ri:apps-2-fill',
    label: 'Caprover',
    auth: true,
  },
  {
    link: '/login',
    icon: 'material-symbols:login-rounded',
    label: 'Login',
    auth: false,
  },
  {
    link: '/profile',
    icon: 'material-symbols:account-box-sharp',
    label: 'Profile',
    auth: true,
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
  <div ref="SideNavBar" class="flex flex-col items-center justify-between w-20 h-full bg-zinc-800 text-white p-1 py-3">
    <div class=" flex flex-col  w-full  justify-center items-center  space-y-3">
      <UTooltip v-for="navItem in items" :key="navItem.label" :text="navItem.label" :popper="{ placement: 'right' }">
        <NuxtLink :to="navItem.link" class="flex items-center justify-center " active-class="active">
          <RippleBtn>
            <Icon :name="navItem.icon" class="text-5xl" />
          </RippleBtn>
        </NuxtLink>
      </UTooltip>
    </div>
  </div>
</template>

<style scoped>
.active{
@apply text-emerald-300 bg-gray-200/20 cursor-pointer rounded-md
}
</style>
