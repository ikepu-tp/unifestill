<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckRequest extends FormRequest
{
    use Project;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $this->getProject();
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        if ($this->routeIs("*.index", "*.show", "*.destroy")) return [];
        return [
            "member_id" => ["required", "string"],
            "bill_10" => ["required", "numeric"],
            "bill_5" => ["required", "numeric"],
            "bill_2" => ["required", "numeric"],
            "bill_1" => ["required", "numeric"],
            "coin_500" => ["required", "numeric"],
            "coin_100" => ["required", "numeric"],
            "coin_50" => ["required", "numeric"],
            "coin_5" => ["required", "numeric"],
            "coin_1" => ["required", "numeric"],
        ];
    }

    public function attributes()
    {
        return [
            'member_id' => 'メンバー',
            'bill_10' => '1万円札',
            'bill_5' => '5千円札',
            'bill_2' => '2千円札',
            'bill_1' => '千円札',
            'coin_500' => '500円玉',
            'coin_100' => '100円玉',
            'coin_50' => '50円玉',
            'coin_5' => '5円玉',
            'coin_1' => '1円玉',
        ];
    }
}