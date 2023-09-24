<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotMatchCsrf_TokenException extends ErrorException
{
    public $abstract = 'NOT MATCH CSRF-TOKEN';
    public $title = 'CSRFトークン不一致';
    public $errorCode = 401003;
}
