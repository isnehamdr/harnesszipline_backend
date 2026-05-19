<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class JobEnquiry extends Model
{
    //

    protected $fillable = [
        'job_id',
        'full_name',
        'email',
        'phone_number',
        'description',
        'cv',
        'is_archived',
    ];

    public function job()
    {
        return $this->belongsTo(JobTable::class, 'job_id');
    }

    protected static function booted(): void
    {
        static::created(function (JobEnquiry $jobEnquiry) {
            $jobEnquiry->createActivityLog('Created');
        });

        static::updated(function (JobEnquiry $jobEnquiry) {
            $jobEnquiry->createActivityLog('Updated');
        });

        static::deleted(function (JobEnquiry $jobEnquiry) {
            $jobEnquiry->createActivityLog('Deleted');
        });
    }

    private function createActivityLog(string $action): void
    {
        try {
            ActivityLog::create([
                'name' => Auth::user()?->name ?? 'System',
                'ip_address' => request()->ip(),
                'title' => "{$action} job enquiry: {$this->full_name}",
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
