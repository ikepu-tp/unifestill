<x-app-layout>
  <!-- Scripts -->
  @vite(['resources/react/index.tsx'])
  <x-slot name="header">
    会計
  </x-slot>

  <div class="bg-white shadow rounded px-3 py-4 mt-2">
    <div id="root"></div>
  </div>
</x-app-layout>
