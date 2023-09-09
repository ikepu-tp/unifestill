<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class SaveFailedException extends ErrorException
{
    public $abstract = 'SAVE FAILED';
    public $title = '保存失敗';
    public $errorCode = 500002;
}
