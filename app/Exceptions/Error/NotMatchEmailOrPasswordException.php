<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotMatchEmailOrPasswordException extends ErrorException
{
    public $abstract = 'NOT MATCH EMAIL OR PASSWORD';
    public $title = '認証失敗';
    public $errorCode = 401001;
}
