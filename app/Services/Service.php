<?php

namespace App\Services;

class Service
{
    /**
     * convert query(string) to boolean
     * クエリの文字列を真偽値に変換
     *
     * @param mixed $query
     * @return boolean
     */
    public static function convertQueryToBoolean(mixed $query): bool
    {
        switch ((string)$query) {
            case "false":
            case "0":
            case "null":
            case "undefined":
                return false;
            default:
                return true;
        }
    }

    /**
     * convert full-width space to half-width space
     * 全角スペースを半角スペースに変換
     *
     * @param string $keyword
     * @return string
     */
    public static function convertFullSpaceToHalfSpace(string $keyword): string
    {
        return str_replace("　", " ", $keyword);
    }

    /**
     * Search by LIKE Clause in Eloquent
     * EloquentにおいてLIKE句による検索
     *
     * @param mixed $model
     * @param string $column
     * @param string|null|array $keyword
     * @return void
     */
    public static function searchKeyword(mixed $model, string $column, string|null|array $keyword)
    {
        if (is_null($keyword)) return $model;
        if (is_array($keyword)) {
            $keywords = $keyword;
        } else {
            $keywords = explode(" ", static::convertFullSpaceToHalfSpace($keyword));
        }
        return $model->where(function ($query) use ($column, $keywords) {
            foreach ($keywords as $word) {
                if (!is_string($word)) continue;
                $query->orWhere($column, "LIKE", "%{$word}%");
            }
        });
    }
}
