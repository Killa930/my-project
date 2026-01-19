<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TestDrive;
use Illuminate\Http\Request;

class TestDriveController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id' => ['required','integer','exists:cars,id'],
            'name' => ['required','string','max:100'],
            'phone' => ['required','string','max:30'],
            'email' => ['nullable','email','max:150'],
            'preferred_at' => ['nullable','date'],
        ]);

        return TestDrive::create($data);
    }
}

