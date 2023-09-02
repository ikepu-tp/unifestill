<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class UnauthorizedException extends ErrorException
{
    public $abstract = 'UNAUTHORIZED';
    public $title = '認証失敗';
    public $errorCode = 401000;
}
