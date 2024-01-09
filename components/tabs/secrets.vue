<template>
  <div>
    <div class="w-full">
      <form class="">
        <div class="mb-4">
          <div class="lg:flex space-x-3">
            <div class="flex space-x-3">
              <div>
                <label class="block dark:text-white text-gray-700 text-3xl font-bold mb-2" for="name">
                  Name
                </label>
                <input
                  id="name"
                  class="h-12 shadow appearance-none border rounded w-full py-2 px-3 dark:text-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text" placeholder="Enter name"
                >
              </div>
              <div>
                <label class="block dark:text-white text-gray-700 text-3xl font-bold mb-2" for="value">
                  Value
                </label>
                <input
                  id="value"
                  class="h-12 shadow appearance-none border rounded w-full py-2 px-3 dark:text-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text" placeholder="Enter value"
                >
              </div>
              <div class="flex items-center">
                <label class="block dark:text-white text-gray-700 text-3xl font-bold mb-2" for="build-time">
                  Need During BuildTime?
                </label>
                <input id="build-time" class="ml-2" type="checkbox">
              </div>
            </div>
            <button class="bg-amber-400 p-2 rounded-md px-4">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="p-2">
      <div class="lg:flex space-x-3">
        <div class="flex items-center">
          <label class="block dark:text-white text-gray-700 text-3xl font-bold mb-2" for="preview">
            Preview Secrets
          </label>
          <UTooltip>
            <UIcon name="uil:info-circle" class="text-2xl" />
            <template #text>
              <span class="italic">Hello World!</span>
            </template>
          </UTooltip>
        </div>
      </div>
      <hr class="my-2">
      <div>
        <label class="block dark:text-white text-gray-700 text-3xl font-bold mb-2" for="enc-file">
          Past.envFile
        </label>
        <button class="bg-amber-400 p-2 rounded-md px-4">
          Add
        </button>
        <textarea
          id="enc-file"
          class="h-24 shadow appearance-none border rounded w-full py-2 px-3 dark:text-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
          placeholder="Enter Past.encFile"
        />
      </div>
    </div>
  </div>
</template>
