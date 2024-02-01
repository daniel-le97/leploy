<script setup lang="ts">
import { z } from 'zod'
import consola from 'consola'

const schema = z.object({
  repoUrl: z.string().min(1),
  installCommand: z.string().nullable(),
  buildCommand: z.string().nullable(),
  startCommand: z.string().nullable(),
  buildPack: z.string().min(1, 'Must be at least 8 characters'),
  // baseDirectory: z.string().default('/'),
  // publishDirectory: z.string().default('/'),
  // branch: z.string().default('main'),
})

const onePort = ref('')

type Schema = z.output<typeof schema>

const state = useLiteProject()
const https = ref<boolean>(state.value.https === 1)
watch(https, (value) => {
  state.value.https = value ? 1 : 0
})
const options = [
  { label: 'nixpacks', value: 'nixpacks' },
  { label: 'dockerfile', value: 'dockerfile' },
  { label: 'docker-compose', value: 'docker-compose' },
]

async function onSubmit() {
  try {
    console.log(state.value)
    const data = await $fetch<SqliteProject>(`/api/projects/${state.value.id}`, {
      method: 'PUT',
      body: state.value,
    })

    useToast().add({
      id: state.value.id,
      title: 'Configuration Updated',
      timeout: 1500,
    })
  }
  catch (error) {
    consola.withTag('configuration').error('unable to update configuration')
  }
}

function updateBool(value: any) {
  console.log(value)
}

const filePath = reactive({
  label: 'Dockerfile location',
  name: '/Dockerfile',
})
watch(state.value, (value) => {
  if (value.buildPack === 'dockerfile') {
    filePath.label = 'Dockerfile location'
    state.value.filePath = state.value.filePath.includes('.yml') ? '/Dockerfile' : state.value.filePath
  }

  if (value.buildPack === 'nixpacks')
    state.value.filePath = ''

  if (value.buildPack === 'docker-compose') {
    filePath.label = 'docker-compose location'
    state.value.filePath = state.value.filePath.includes('.yml') ? state.value.filePath : '/docker-compose.yml'
  }
})

const needsfilePath = computed(() => state?.value.buildPack === 'nixpacks')
</script>

<template>
  <div v-if="state.id">
    <UForm :schema=" schema " :state=" state " class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Repo URL" name="repoUrl">
        <UInput v-model=" state.repoUrl " type="url" />
      </UFormGroup>

      <div class="flex space-x-4">
        <div class="w-1/2 flex flex-col space-y-3">
          <UFormGroup label="Install command" name="installCommand">
            <UInput v-model=" state.installCommand " placeholder="npm install" type="text" />
          </UFormGroup>
          <UFormGroup label="Build command" name="buildCommand">
            <UInput v-model=" state.buildCommand " placeholder="npm run build" type="text" />
          </UFormGroup>
          <UFormGroup label="Start command" name="startCommand">
            <UInput v-model=" state.startCommand " placeholder="npm run serve" type="text" />
          </UFormGroup>
        </div>
        <div class="w-1/2">
          <UFormGroup label="choose a build pack" name="buildPack">
            <USelect v-model=" state.buildPack" :options=" options " />
          </UFormGroup>
          <UFormGroup label="please specify ports" name="ports">
            <UInput v-model="state.ports" placeholder="3000,3001" />
          </UFormGroup>
          <!-- <UFormGroup label="use our proxy?" name="proxy">
            <input v-model="state.c" type="checkbox">
          </UFormGroup> -->
          <UFormGroup label="https" name="https">
            <input v-model="https" type="checkbox">
          </UFormGroup>
          <UFormGroup v-if="!needsfilePath" :label="filePath.label" name="filePath">
            <UInput v-model="state.filePath" />
          </UFormGroup>
          <!-- <div class="flex gap-2">
            <div class="w-1/2">
              <UFormGroup label="base directory" name="buildPack">
                <USelect v-model=" state.application.buildPack" :options=" options " />
              </UFormGroup>
            </div>
            <div class="w-1/2">
              <UFormGroup label="publish directory" name="buildPack">
                <USelect v-model=" state.application.buildPack" :options=" options " />
              </UFormGroup>
            </div>
          </div> -->
        </div>
      </div>

      <RippleBtn type="submit" class="rounded bg-primary">
        Save
      </RippleBtn>
    </UForm>
  </div>
  <div v-else>
    loading...
  </div>
</template>
