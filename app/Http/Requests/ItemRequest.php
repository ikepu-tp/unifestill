<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
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
            "parent_id" => ["nullable", "string"],
            "name" => ["required", "string", "max:30"],
            "note" => ["nullable", "string", "max:100"],
            "price" => ["required", "numeric"],
        ];
    }

    public function attributes()
    {
        return [
            'parent_id' => '親商品',
            'name' => '名前',
            'note' => '備考',
            'price' => '金額',
        ];
    }
}
