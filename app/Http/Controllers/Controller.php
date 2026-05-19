<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    protected function logActivity(string $title): void
    {
        try {
            ActivityLog::create([
                'name' => Auth::user()?->name ?? 'System',
                'ip_address' => request()->ip(),
                'title' => $title,
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
