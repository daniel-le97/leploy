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

const state = useActiveProject()
// console.log(state.value)

onePort.value = state.value.ports.join(',')

const options = [
  { label: 'nixpacks', value: 'nixpacks' },
  { label: 'dockerfile', value: 'dockerfile' },
  { label: 'docker-compose', value: 'docker-compose' },
]

async function onSubmit() {
  state.value.ports = onePort.value ? onePort.value.split(',') : []
  try {
    // console.log(state.value)

    const { data } = await useFetch<Project>(`/api/projects/${state.value.id}`, {
      method: 'PUT',
      body: state.value,
    })

    if (!data.value)
      throw new Error('unable to update config')

    useToast().add({
      id: state.value.id,
      title: 'Configuration Updated',
      timeout: 1500,
    })

    useActiveProject().value = data.value
  }
  catch (error) {
    consola.withTag('configuration').error('unable to update configuration')
  }
}

const needsRepo = computed(() => state?.value?.application?.buildCommand === 'nixpacks')
</script>

<template>
  <div v-if="state.application">
    <UForm :schema=" schema " :state=" state.application " class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Repo URL" name="repoUrl" :required="needsRepo">
        <UInput v-model=" state.application.repoUrl " type="url" />
      </UFormGroup>

      <div class="flex space-x-4">
        <div class="w-1/2 flex flex-col space-y-3">
          <UFormGroup label="Install command" name="installCommand">
            <UInput v-model=" state.application.installCommand " placeholder="npm install" type="text" />
          </UFormGroup>
          <UFormGroup label="Build command" name="buildCommand">
            <UInput v-model=" state.application.buildCommand " placeholder="npm run build" type="text" />
          </UFormGroup>
          <UFormGroup label="Start command" name="startCommand">
            <UInput v-model=" state.application.startCommand " placeholder="npm run serve" type="text" />
          </UFormGroup>
        </div>
        <div class="w-1/2">
          <UFormGroup label="choose a build pack" name="buildPack">
            <USelect v-model=" state.application.buildPack" :options=" options " />
          </UFormGroup>
          <UFormGroup label="please specify ports" name="ports">
            <UInput v-model="onePort" placeholder="3000,3001" />
          </UFormGroup>
          <UFormGroup label="use our proxy?" name="proxy">
            <input v-model="state.managed" type="checkbox">
          </UFormGroup>
          <UFormGroup label="https" name="https">
            <input v-model="state.https" type="checkbox">
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
