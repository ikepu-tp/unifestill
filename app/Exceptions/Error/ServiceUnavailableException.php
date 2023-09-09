<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class ServiceUnavailableException extends ErrorException
{
    public $abstract = 'SERVICE UNAVAILABLE';
    public $title = 'サービス利用不可';
    public $errorCode = 503000;
}
