<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        if ($this->routeIs(["*.index", "*.show", "*.destroy"])) return [];
        if ($this->routeIs("progress.guest.update")) return [
            "logged" => ["boolean"],
        ];
        return [
            "need_auth" => ["boolean"],
            "logged" => ["boolean"],
        ];
    }
}
