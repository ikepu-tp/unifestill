<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class OverParametersException extends ErrorException
{
    public $abstract = 'OVER PARAMETERS';
    public $title = '過剰パラメータ';
    public $errorCode = 406002;
}
