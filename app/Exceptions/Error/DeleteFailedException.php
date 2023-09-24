<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class DeleteFailedException extends ErrorException
{
    public $abstract = "DELETE FAILED";
    public $title = "削除失敗";
    public $errorCode = 500003;
}
