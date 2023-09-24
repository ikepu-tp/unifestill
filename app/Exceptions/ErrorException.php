<?php

namespace App\Exceptions;

use Exception;

class ErrorException extends Exception
{
    public array $messages = [];
    /**
     * @var string
     */
    public $abstract = "BAD REQUEST";
    /**
     * @var string
     */
    public $title = "クライアントエラー";
    /**
     * @var integer
     */
    public $errorCode = 400000;

    public function __construct(array|string $messages = [])
    {
        $this->messages = is_string($messages) ? [$messages] : $messages;
    }

    /**
     * エラーリソース取得
     *
     * @return array
     */
    public function getError(): array
    {
        return [
            "abstract" => $this->getAbstract(),
            "title" => $this->getTitle(),
            "code" => $this->getErrorCode(),
            "messages" => $this->getMessages(),
        ];
    }

    /**
     * アブストラクト取得
     *
     * @return string
     */
    public function getAbstract(): string
    {
        return $this->abstract;
    }

    /**
     * エラータイトル取得
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * エラーコード取得
     *
     * @return integer
     */
    public function getErrorCode(): int
    {
        return $this->errorCode;
    }

    /**
     * HTTPコード取得
     *
     * @return integer
     */
    public function getHttpCode(): int
    {
        return (int)substr((string)$this->getErrorCode(), 0, 3);
    }

    /**
     * エラーメッセージ取得
     *
     * @return array
     */
    public function getMessages(): array
    {
        return $this->messages;
    }
}
