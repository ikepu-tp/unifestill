<header class="d-block d-print-none navbar navbar-expand-lg navbar-light bg-light p-0">
  <div class="container-fluid p-0">
    <a href="{{ route('app', ['fallbackPlaceholder' => '/']) }}" class="navbar-brand p-0">
      <img src="{{ asset('img/logo.png') }}" alt="UniFesTill" style="height: 70px;" />
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#_header-nav"
      aria-controls="_header-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse collapse visible ps-3" id="_header-nav">
      <ul class="navbar-nav ms-auto mb-2">
        <li class="nav-item">
          <a href="{{ route('app', ['fallbackPlaceholder' => '/']) }}" class="nav-link">HOME</a>
        </li>
        <li class="nav-item dropdown">
          <a href="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{ Auth::guard('associations')->user()->name }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="{{ route('profile.edit') }}">プロフィール設定</a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="btn dropdown-item">ログアウト</button>
              </form>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</header>
