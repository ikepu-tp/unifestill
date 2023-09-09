<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class ForbittenException extends ErrorException
{
    public $abstract = 'FORBITTEN';
    public $title = 'アクセス不可';
    public $errorCode = 403000;
}
