<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class BadRequestException extends ErrorException
{
    public $abstract = "BAD REQUEST";
    public $title = "クライアントエラー";
    public $errorCode = 400000;
}
