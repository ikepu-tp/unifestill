<x-app-layout>
  <x-slot name="header">
    プロフィール設定
  </x-slot>

  <div class="px-3 py-4 mt-2">
    <div class="p-4 bg-white shadow rounded mb-5">
      @include('profile.partials.update-profile-information-form')
    </div>

    <div class="p-4 bg-white shadow rounded mb-5">
      @include('profile.partials.update-password-form')
    </div>

    <div class="p-4 bg-white shadow rounded">
      @include('profile.partials.delete-user-form')
    </div>
  </div>
</x-app-layout>
