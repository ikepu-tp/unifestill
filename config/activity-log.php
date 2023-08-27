<?php

return [
    /**
     * ----------------------------------------------------------------
     * Guard
     * ----------------------------------------------------------------
     * Set default guard. But you can set guard by route name.
     */
    "guard" => "web",

    /**
     * ----------------------------------------------------------------
     * Activity text
     * ----------------------------------------------------------------
     * Set default activity text. But you can set activity text by route name.
     * You can use variables below.
     *  - path
     *  - activity
     */
    "activity_text" => ":pathに:activityをしました",

    /**
     * ----------------------------------------------------------------
     * All activities
     * ----------------------------------------------------------------
     * Do you want to log all activities even though not configuring route names on `activities` below?
     */
    "all_activities" => true,

    /**
     * ----------------------------------------------------------------
     * Activities
     * ----------------------------------------------------------------
     * Set activities by route name.
     * The minimum configure is `"route_name"=>"activity text"`.
     * If you want to set details, you can use keys below.
     *  - path
     *  - activity
     *  - guard
     */
    "activities" => [
        //"dashboard" => "ダッシュボードの閲覧",

        "user.update" => [
            "activity" => "ユーザー情報を更新しました",
            "guard" => "web",
        ],
        /** These configures above and below are same. **/
        "user" => [
            "update" => [
                "activity" => "ユーザー情報を更新しました",
                "guard" => "web",
            ],
        ]
    ],
];