<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class CreateForbittenException extends ErrorException
{
    public $abstract = "CREATE FORBITTEN";
    public $title = "登録不可";
    public $errorCode = 403002;
}
