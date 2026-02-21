<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    protected $fillable = [
        'title', 
        'short_description', 
        'long_description', 
        'image', 
        'meta_data', 
        'is_archived', 
        'slug',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
        'meta_data' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($blog) {
            // Generate base slug from title
            $baseSlug = Str::slug($blog->title);

            // Append ID to make it unique
            $uniqueSlug = $baseSlug . '-' . $blog->id;

            // Update slug after creation
            $blog->slug = $uniqueSlug;
            $blog->saveQuietly(); // Use saveQuietly to avoid triggering events again
        });

        // Also handle slug before creating if needed
        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title) . '-temp';
            }
        });
    }
}