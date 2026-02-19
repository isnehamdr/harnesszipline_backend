<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Gallery extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'is_archived',
        'is_featured',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($gallery) {
            // Set a temporary slug from the name before creation
            $gallery->slug = Str::slug($gallery->name);
        });

        static::created(function ($gallery) {
            // Append the ID after creation to guarantee uniqueness
            $gallery->slug = Str::slug($gallery->name) . '-' . $gallery->id;
            $gallery->saveQuietly();
        });
    }

    public function images()
    {
        return $this->hasMany(GalleryImage::class);
    }
}