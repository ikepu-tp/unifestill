<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class ConflictException extends ErrorException
{
    public $abstract = "CONFLICT";
    public $title = "データ競合";
    public $errorCode = 409000;
}
