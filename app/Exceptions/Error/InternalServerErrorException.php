<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class InternalServerErrorException extends ErrorException
{
    public $abstract = 'INTERNAL SERVER ERROR';
    public $title = 'サーバエラー';
    public $errorCode = 500000;
}
