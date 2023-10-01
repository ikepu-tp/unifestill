<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountRequest extends FormRequest
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
        if ($this->routeIs("*.update")) return ["order_status" => ["string"],];
        return [
            "member_id" => ["required", "string"],
            "price" => ["required", "numeric"],
            "payments" => ["required", "array"],
            "payments.*.payment_id" => ["required", "string"],
            "payments.*.price" => ["required", "numeric"],
            "items.*.item_id" => ["required", "string"],
            "items.*.price" => ["required", "numeric"],
            "items.*.quantity" => ["required", "numeric"],
            "items.*.children" => ["array"],
            "items.*.children.*.item_id" => ["required", "string"],
            "items.*.children.*.price" => ["required", "numeric"],
            "items.*.children.*.quantity" => ["required", "numeric"],
            "order_status" => ["string"],
        ];
    }

    public function attributes()
    {
        return [
            'member_id' => 'メンバー',
            'price' => '金額',
            'payments.*.payment_id' => '支払い方法',
            'payments.*.price' => '支払金額',
            'items.*.item_id' => '商品',
            'items.*.price' => '商品金額',
            'items.*.quantity' => '商品個数',
            'items.*.children.*.items' => '子商品',
        ];
    }
}
