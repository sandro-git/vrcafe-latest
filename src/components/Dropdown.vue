<template>
  <Popover class="relative">
    <PopoverButton class="inline-flex items-center gap-x-1  rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500">
      <span>Experiences VR</span>
      <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
    </PopoverButton>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
      <PopoverPanel class="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
        <div class="w-56 shrink rounded-xl bg-white  dark:border-gray-600 dark:bg-gray-900 text-white p-4 text-sm font-semibold leading-6  shadow-lg ring-1 ring-gray-900/5">
          <a v-for="item in solutions" :key="item.name" :href="item.href" class="block p-2 hover:text-indigo-600">{{ item.name }}</a>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const solutions = [
  { name: 'Escapes Games VR', href: '/experiences/escapes' },
  { name: 'Jeux VR', href: '/experiences/jeux' },
  { name: 'Free roaming', href: '/experiences/freeroaming' },
]
</script>