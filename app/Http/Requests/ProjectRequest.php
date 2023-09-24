<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    use Project;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->routeIs("*.index", "*.store")) return true;
        if ($this->routeIs("*.show", "*.update", "*.destroy")) {
            $this->getProject();
            return true;
        }
        return false;
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
            "name" => ["required", "string", "max:30"],
            "note" => ["nullable", "string", "max:100"],
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'プロジェクト名',
            'note' => '備考',
        ];
    }
}
