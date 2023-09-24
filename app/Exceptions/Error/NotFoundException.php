<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotFoundException extends ErrorException
{
    public $abstract = 'NOT FOUND';
    public $title = '存在しないパス';
    public $errorCode = 404000;
}
