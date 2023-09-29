<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>{{ config('app.name', 'Laravel') }}</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

  <!-- Scripts -->
  @vite(['resources/js/app.js'])
  @if (true)
    @vite(['resources/css/app.css'])
  @endif
  @viteReactRefresh
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
</head>

<body class="font-sans antialiased" style="min-height: 100vh;">
  <div class="position-relative pb-5" style="min-height: 100vh;">
    @include('layouts.header')

    <div class="mb-5">

      <!-- Page Heading -->
      @if (isset($header))
        <header class="bg-white shadow-sm d-print-none py-2 px-3 mb-3">
          <div class="font-semibold text-xl text-gray-800 leading-tight px-3 py-2">
            {{ $header }}
          </div>
        </header>
      @endif

      <!-- Page Content -->
      <main class="container">
        {{ $slot }}
      </main>

      @include('layouts.footer')

    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
</body>

</html>
