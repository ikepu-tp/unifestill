<?php

namespace App\Exceptions;

use App\Exceptions\Error\UnauthorizedException;
use App\Exceptions\Error\NotMatchCsrf_TokenException;
use App\Exceptions\Error\ForbittenException;
use App\Exceptions\Error\NotFoundException;
use App\Exceptions\Error\MethodNotAllowedException;
use App\Exceptions\Error\ValidationErrorException;
use App\Exceptions\ErrorException as ExceptionsErrorException;
use App\Http\Resources\Resource;
use BadMethodCallException;
use ErrorException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    protected $dontReport = [
        ExceptionsErrorException::class,
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) return $this->renderApi($request, $e);
        return $this->renderWeb($request, $e);
    }

    /**
     * WEB時の返却
     *
     * @param [type] $request
     * @param Throwable $e
     * @return void
     */
    public function renderWeb($request, Throwable $e)
    {
        if ($e instanceof AuthenticationException) return parent::render($request, $e);
        $e = $this->convertOriginalError($e);
        return parent::render($request, $e);
    }

    /**
     * API時の返却
     *
     * @param [type] $request
     * @param Throwable $e
     * @return JsonResponse|Response
     */
    public function renderApi($request, Throwable $e): JsonResponse|Response
    {
        $e = $this->convertOriginalError($e);
        $checkOriginalException = $this->checkOriginalException($e);
        if (!$checkOriginalException) return parent::render($request, $e);
        return Resource::fail(
            $checkOriginalException["abstract"],
            $checkOriginalException["title"],
            $checkOriginalException["code"],
            $checkOriginalException["messages"],
        );
    }

    /**
     * エラー内容取得
     *
     * 1. オリジナルエラーの確認
     * 2. フレームワークエラーの確認
     * 　→オリジナルエラーインスタンス作成
     * 3. オリジナルエラーでない場合，falseを返却
     *
     * @param Throwable $e
     * @return array|false
     */
    public function checkOriginalException(Throwable $e): array|false
    {
        $e = $this->convertOriginalError($e);
        if ($e instanceof ExceptionsErrorException) return $e->getError();

        return false;
    }

    /**
     * オリジナルエラーを取得
     *
     * @param Throwable $e
     * @return ExceptionsErrorException|Throwable
     */
    public function convertOriginalError(Throwable $e): ExceptionsErrorException|Throwable
    {
        if ($e instanceof ExceptionsErrorException) return $e;

        //フレームワークエラー
        if ($e instanceof MethodNotAllowedHttpException) return new MethodNotAllowedException([$e->getMessage()]);
        if ($e instanceof NotFoundHttpException) return new NotFoundException([$e->getMessage()]);
        if ($e instanceof TokenMismatchException) return  new NotMatchCsrf_TokenException([$e->getMessage()]);
        if ($e instanceof ValidationException) return new ValidationErrorException($e->errors());
        if ($e instanceof BadMethodCallException) return new MethodNotAllowedException([$e->getMessage()]);
        if (
            $e instanceof AuthorizationException ||
            $e instanceof AuthenticationException
        ) return new UnauthorizedException([$e->getMessage()]);
        if ($e instanceof AccessDeniedHttpException) return new ForbittenException("アクセスが禁止されています");
        if ($e instanceof ThrottleRequestsException) {
            $exception = new ExceptionsErrorException(["リクエストが多すぎます", "時間をおいてから再試行してください"]);
            $exception->abstract = "TOO MANY ATTEMPTS";
            $exception->title = "過剰リクエスト";
            $exception->errorCode = 429000;
            return $exception;
        }
        if ($e instanceof ErrorException) return new ExceptionsErrorException($e->getMessage());

        return $e;
    }
}