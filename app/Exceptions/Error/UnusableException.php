<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class UnusableException extends ErrorException
{
    public $abstract = 'UNUSABLE';
    public $title = '利用不可';
    public $errorCode = 401004;
}
