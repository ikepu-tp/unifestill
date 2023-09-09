<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class MethodNotAllowedException extends ErrorException
{
    public $abstract = 'METHOD NOT ALLOWED';
    public $title = '許可されていないメソッド';
    public $errorCode = 405000;
}
