<?php

return [
    /**
     * ----------------------------------------------------------------
     * Driver to store logs
     * ----------------------------------------------------------------
     *  Configure `database` or `file`.
     */
    "driver" => env("ACCESS_LOGGER_DRIVER", "database"),

    /**
     * ----------------------------------------------------------------
     * Keys
     * ----------------------------------------------------------------
     *  Configure keys separated `,` without spaces.
     */
    "keys" => explode(',', env('ACCESS_LOGGER_KEYS', "web,api")),

    /**
     * ----------------------------------------------------------------
     * Guard
     * ----------------------------------------------------------------
     * Configure guard.
     * If you want to separate by key, configure guards and change guard to `false`.
     */
    "guard" => "web", //false,

    /**
     * ----------------------------------------------------------------
     * Guards
     * ----------------------------------------------------------------
     * If you want to separate by key, configure guards and change guard to `false`.
     */
    "guards" => [
        "web" => "web",
        "api" => "api",
    ],

    /**
     * ----------------------------------------------------------------
     * Except
     * ----------------------------------------------------------------
     * If you want to except on request bodies like password, configure except.
     */
    "except" => ["password", "current_password", "password_confirmation"],
];
