<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotExistRecordException extends ErrorException
{
    public $abstract = 'NOT EXIST RECORD';
    public $title = '存在しないレコード';
    public $errorCode = 404001;
}
