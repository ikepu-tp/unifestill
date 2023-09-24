<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotAcceptableException extends ErrorException
{
    public $abstract = 'NOT ACCEPTABLE';
    public $title = '受付不可能な値，バリデーションエラー';
    public $errorCode = 406000;
}
