<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
