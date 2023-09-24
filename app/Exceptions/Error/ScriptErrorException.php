<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class ScriptErrorException extends ErrorException
{
    public $abstract = 'SCRIPT ERROR';
    public $title = 'スクリプトエラー';
    public $errorCode = 500001;
}
