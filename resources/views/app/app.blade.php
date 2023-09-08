<x-app-layout>
  <!-- Scripts -->
  @viteReactRefresh
  @vite(['resources/react/index.tsx', 'resources/js/app.js'])
  <x-slot name="header">
    <h2 class="font-semibold text-xl text-gray-800 leading-tight">
      会計
    </h2>
  </x-slot>

  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div id="root"></div>
      </div>
    </div>
  </div>
</x-app-layout>
