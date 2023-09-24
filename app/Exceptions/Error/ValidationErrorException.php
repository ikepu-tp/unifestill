<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class ValidationErrorException extends ErrorException
{
    public $abstract = 'VALIDATION ERROR';
    public $title = '入力値エラー';
    public $errorCode = 406003;
}
