<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotAcceptQueriesException extends ErrorException
{
    public $abstract = 'NOT ACCEPT QUERIES';
    public $title = 'クエリ不可';
    public $errorCode = 406005;
}
