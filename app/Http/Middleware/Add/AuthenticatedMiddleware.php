<?php

namespace App\Http\Middleware\Add;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user("associations")) {
            if ($request->user("web"))
                Auth::guard("associations")->login($request->user("web"), true);
        }
        return $next($request);
    }
}