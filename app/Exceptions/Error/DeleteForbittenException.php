<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class DeleteForbittenException extends ErrorException
{
    public $abstract = "DELETE FORBITTEN";
    public $title = "削除不可";
    public $errorCode = 403003;
}
