<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Room extends Model
{
    //
    protected $fillable = [
        'name', 'order', 'no_of_room', 'no_of_children', 'no_of_adult', 'price', 'short_description', 'long_description', 'room_type_id', 'refrence_id', 'meta_data', 'is_archived', 'is_featured', 'slug',
    ];

    protected $casts = [
        'meta_data' => 'array',
        'is_archived' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function images()
    {
        return $this->hasMany(RoomImage::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Before creating: generate base slug from name
        static::creating(function ($room) {
            if (empty($room->slug)) {
                $randomSuffix = rand(10000, 99999);
                $room->slug = Str::slug($room->name).'-'.$randomSuffix;
            }
        });

        // After created: append ID to make slug unique
        static::created(function ($room) {
            $randomSuffix = rand(10000, 99999);
            $room->slug = Str::slug($room->name).'-'.$randomSuffix;
            $room->saveQuietly(); // prevents infinite loop
        });

        // On update: regenerate slug with new random suffix
        static::updating(function ($room) {
            if ($room->isDirty('name')) {
                $randomSuffix = rand(10000, 99999);
                $room->slug = Str::slug($room->name).'-'.$randomSuffix;
            }
        });
    }
}
