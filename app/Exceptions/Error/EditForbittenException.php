<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class EditForbittenException extends ErrorException
{
    public $abstract = 'EDIT FORBITTEN';
    public $title = '編集不可';
    public $errorCode = 403001;
}
