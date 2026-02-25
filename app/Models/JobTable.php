<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str; // Add this import

class JobTable extends Model
{
    protected $table = 'job_tables'; // Specify table name if not plural convention
    
    protected $fillable = [
        'title', 
        'short_description', 
        'content', 
        'meta_data', 
        'is_archived',
        'slug'
    ];

    protected $casts = [
        'meta_data' => 'array', // Auto-cast JSON to array
        'is_archived' => 'boolean',
    ];

    public function enquiries()
    {
        return $this->hasMany(JobEnquiry::class, 'job_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($job) {
            // Generate slug before creating
            $job->slug = Str::slug($job->title);
        });

        static::created(function ($job) {
            // Make slug unique by appending ID
            $job->slug = Str::slug($job->title) . '-' . $job->id;
            $job->saveQuietly();
        });

        static::updating(function ($job) {
            // Update slug if title changed
            if ($job->isDirty('title')) {
                $job->slug = Str::slug($job->title) . '-' . $job->id;
            }
        });
    }
}