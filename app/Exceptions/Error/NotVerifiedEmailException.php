<?php

namespace App\Exceptions\Error;

use App\Exceptions\ErrorException;

class NotVerifiedEmailException extends ErrorException
{
    public $abstract = 'NOT VERIFIED EMAIL';
    public $title = 'メールアドレス未認証';
    public $errorCode = 406006;
}
