<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotAcceptHeaderException extends ErrorException
{
    public $abstract = 'NOT ACCEPT HEADER';
    public $title = 'ヘッダ不可';
    public $errorCode = 406007;
}
