<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id' => ['nullable','integer','exists:cars,id'],
            'name' => ['required','string','max:100'],
            'phone' => ['required','string','max:30'],
            'email' => ['nullable','email','max:150'],
            'message' => ['nullable','string','max:2000'],
            'type' => ['required','in:buy,price,question'],
        ]);

        return Lead::create($data);
    }
}

