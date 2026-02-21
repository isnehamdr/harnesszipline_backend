<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Activity extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'short_description',
        'long_description',
        'base_price',
        'meta_data',
        'is_archived',
        'is_featured',
    ];

    protected $casts = [
        'meta_data' => 'array',
        'base_price' => 'decimal:2',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($activity) {
            $activity->slug = Str::slug($activity->name);
        });

        static::created(function ($activity) {
            $activity->slug = Str::slug($activity->name) . '-' . $activity->id;
            $activity->saveQuietly();
        });
    }

    public function images()
    {
        return $this->hasMany(ActivityImage::class);
    }
}