<x-app-layout>
  <!-- Scripts -->
  @vite([$source])
  <x-slot name="header">
    会計
  </x-slot>

  <div class="bg-white shadow rounded px-3 py-4 mt-2">
    @isset($contents)
      @foreach ($contents as $key => $value)
        <input type="hidden" id="{{ $key }}" value="{{ $value }}">
      @endforeach
    @endisset
    <div id="root"></div>
  </div>
</x-app-layout>
