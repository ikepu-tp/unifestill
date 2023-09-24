@extends('AccessLogger::layouts.main')
@section('content')
  <div>
    <div class="table-responsive">
      <table class="table striped hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>キー</th>
            <th>[メソッド]パス(ルート名)</th>
            <th>レスポンスコード</th>
            <th>IPアドレス</th>
            <th>デバイス</th>
            <th>ブラウザ</th>
            <th>アクセス日時</th>
          </tr>
        </thead>
        <tbody>
          @foreach ($logs as $log)
            <tr>
              <td>{{ number_format($log->id) }}</td>
              <td>
                {{ $log->key }}</td>
              <td>
                [{{ $log->log_request?->method }}]
                {{ $log->log_request?->path }}
                ({{ $log->log_request?->route_name }})
              </td>
              <td>{{ $log->log_response?->status_code }}</td>
              <td>{{ $log->log_info?->ip_address }}</td>
              <td>{{ $log->log_info?->device }}</td>
              <td>{{ $log->log_info?->browser }}</td>
              <td>{{ $log->created_at }}</td>
            </tr>
          @endforeach
        </tbody>
      </table>
    </div>
    <div class="mt-4">
      {{ $logs->links() }}
    </div>
  </div>
@endsection
