@extends('errors.minimal')

@section('title', $error['title'])
@section('code', $error['code'])
@section('message')
  @if (is_array($error['messages']))
    <ul>
      @foreach ($error['messages'] as $message)
        <li>{{ $message }}</li>
      @endforeach
    </ul>
  @else
    {{ $error['messages'] }}
  @endif
@endsection
