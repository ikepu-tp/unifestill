<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class LackParametersException extends ErrorException
{
    public $abstract = 'LACK PARAMETERS';
    public $title = 'パラメータ不足';
    public $errorCode = 406001;
}
