<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class LackHeaderException extends ErrorException
{
    public $abstract = 'LACK HEADER';
    public $title = 'ヘッダ不足';
    public $errorCode = 406004;
}
